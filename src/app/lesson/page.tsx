"use client";

import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHasMounted } from "@/lib/use-has-mounted";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { NumberPad } from "@/components/number-pad";
import { NumberSequence, TenFrame, TwoFrames } from "@/components/ten-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getTopic } from "@/lib/curriculum";
import { apiCompleteLesson } from "@/lib/api";
import { createLesson, markAnswer } from "@/lib/lesson";
import { generateQuestion, isTopicPlayable } from "@/lib/questions/bank";
import type { Question } from "@/lib/questions/types";
import { ADVANCE_MARK, LESSON_SIZE, RETRY_MARK } from "@/lib/questions/types";
import {
  clearLessonSession,
  loadLessonSession,
  newLessonSeed,
  saveLessonResult,
  saveLessonSession,
  type LessonSession,
} from "@/lib/progress";

function visualFor(question: Question) {
  if (!question.visual) return null;
  if (question.visual.type === "tenFrame") {
    return <TenFrame count={question.visual.count} />;
  }
  if (question.visual.type === "twoFrames") {
    return (
      <TwoFrames left={question.visual.left} right={question.visual.right} />
    );
  }
  return <NumberSequence items={question.visual.items} />;
}

function LessonInner() {
  const router = useRouter();
  const params = useSearchParams();
  const topicId = params.get("topic") ?? "";
  const wantResume = params.get("resume") === "1";
  const wantFresh = params.get("fresh") === "1";
  const { student, loading, setStudent } = useAuth();

  const mounted = useHasMounted();
  const [session, setSession] = useState<LessonSession | null>(null);
  const [draft, setDraft] = useState("");
  const [feedback, setFeedback] = useState<"ok" | "miss" | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const topic = getTopic(topicId);
  const error = !mounted || loading
    ? null
    : !student
      ? "sign-in"
      : !topic
        ? "That topic is not on the path."
        : !isTopicPlayable(topic.id)
          ? "This topic is on the Cambridge Primary path, but its 1000-question bank is not ready yet."
          : !student.unlockedTopicIds.includes(topic.id)
            ? "This topic is still locked. Finish your current lesson first."
            : null;

  const questions = useMemo(() => {
    if (!session) return [];
    return session.indices.map((index) => generateQuestion(session.topicId, index));
  }, [session]);

  const currentQuestion = session ? questions[session.current] : undefined;
  const answeredCount = session
    ? session.answers.filter((answer) => answer != null).length
    : 0;
  const currentIndex = session?.current ?? 0;

  const studentId = student?.id ?? null;

  useEffect(() => {
    if (!mounted || loading) return;
    if (!studentId) {
      router.replace("/");
      return;
    }
    if (error || !topic) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const existing = loadLessonSession();
      const canReuse =
        !wantFresh &&
        existing &&
        existing.studentId === studentId &&
        existing.topicId === topic.id;
      if (canReuse) {
        setSession(existing);
        return;
      }
      const seed = newLessonSeed();
      const plan = createLesson(topic.id, seed);
      const next: LessonSession = {
        studentId,
        topicId: topic.id,
        seed,
        indices: plan.indices,
        answers: Array.from({ length: LESSON_SIZE }, () => null),
        current: 0,
        startedAt: new Date().toISOString(),
      };
      saveLessonSession(next);
      setSession(next);
    });

    return () => {
      cancelled = true;
    };
  }, [mounted, loading, studentId, topic, error, router, wantResume, wantFresh]);

  useEffect(() => {
    if (!feedback) inputRef.current?.focus();
  }, [currentIndex, feedback]);

  function persist(next: LessonSession) {
    setSession(next);
    saveLessonSession(next);
  }

  function submit(value: string) {
    if (!session || !currentQuestion || feedback) return;
    const given = value.trim();
    if (!given) return;

    const answers = session.answers.slice();
    answers[session.current] = given;
    const next = { ...session, answers };
    persist(next);
    setFeedback(markAnswer(currentQuestion, given) ? "ok" : "miss");
  }

  function onCheck(event: FormEvent) {
    event.preventDefault();
    submit(draft);
  }

  async function finish(done: LessonSession) {
    setSaving(true);
    try {
      const result = await apiCompleteLesson({
        topicId: done.topicId,
        seed: done.seed,
        answers: done.answers,
      });
      saveLessonResult(result);
      clearLessonSession();
      const me = await fetch("/api/auth/me", { credentials: "include" }).then(
        (response) => response.json() as Promise<{ student?: typeof student }>,
      );
      if (me.student) setStudent(me.student);
      router.push("/results");
    } catch (err) {
      setSaving(false);
      setFeedback(null);
      alert(err instanceof Error ? err.message : "Could not save this lesson.");
    }
  }

  async function goNext() {
    if (!session || saving) return;
    const nextIndex = session.current + 1;
    if (nextIndex >= session.indices.length) {
      await finish(session);
      return;
    }
    persist({ ...session, current: nextIndex });
    setDraft("");
    setFeedback(null);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Enter") return;
      if (!feedback) return;
      event.preventDefault();
      void goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (error && error !== "sign-in") {
    return (
      <AppShell>
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Cannot start this lesson</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => router.push("/lab")}>Back to the path</Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  if (!session || !currentQuestion) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Picking 20 questions from the bank…</p>
      </AppShell>
    );
  }

  const sessionTopic = getTopic(session.topicId);
  const step = session.current + 1;
  const progress = (answeredCount / LESSON_SIZE) * 100;
  const retryHint =
    student?.pendingRetryTopicId === session.topicId
      ? `Retry: score ${RETRY_MARK} or more to move on.`
      : `Score ${ADVANCE_MARK} to move on, or ${RETRY_MARK}–18 to earn a retry.`;

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="outline">{sessionTopic?.title}</Badge>
            <p className="text-sm font-bold tabular-nums">
              {step} / {LESSON_SIZE}
            </p>
          </div>
          <Progress value={progress} />
          <p className="text-xs font-semibold text-muted-foreground">
            20 questions from a bank of 1000. {retryHint}
          </p>
        </div>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-lg leading-snug text-balance sm:text-xl">
              {currentQuestion.prompt}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-2">
            <div className="flex justify-center">{visualFor(currentQuestion)}</div>

            {currentQuestion.kind === "choice" && currentQuestion.options ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={draft === option ? "default" : "outline"}
                    size="lg"
                    disabled={Boolean(feedback)}
                    onClick={() => setDraft(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            ) : (
              <form onSubmit={onCheck} className="space-y-3">
                <label className="block space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Type your answer
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    enterKeyHint="done"
                    aria-label="Your answer"
                    disabled={Boolean(feedback)}
                    value={draft}
                    onChange={(event) => {
                      const next = event.target.value.replace(/[^\d-]/g, "").slice(0, 3);
                      setDraft(next);
                    }}
                    className="h-14 w-full rounded-2xl border-2 border-primary/40 bg-muted/40 px-3 text-center font-display text-3xl font-semibold tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
                <NumberPad
                  onDigit={(digit) => {
                    if (feedback) return;
                    setDraft((prev) => {
                      const next = prev === "0" ? digit : `${prev}${digit}`;
                      return next.slice(0, 2);
                    });
                  }}
                  onClear={() => {
                    if (!feedback) setDraft("");
                  }}
                  onDelete={() => {
                    if (!feedback) setDraft((prev) => prev.slice(0, -1));
                  }}
                />
                {!feedback ? (
                  <Button type="submit" size="lg" className="w-full" disabled={!draft}>
                    Check
                  </Button>
                ) : null}
              </form>
            )}

            {currentQuestion.kind === "choice" && !feedback ? (
              <Button
                size="lg"
                className="w-full"
                disabled={!draft}
                onClick={() => submit(draft)}
              >
                Check
              </Button>
            ) : null}

            {feedback ? (
              <div
                className={
                  feedback === "ok"
                    ? "rounded-2xl bg-primary/10 px-4 py-3 text-primary"
                    : "rounded-2xl bg-accent/30 px-4 py-3 text-accent-foreground"
                }
                role="status"
              >
                {feedback === "ok" ? (
                  <p className="font-bold">Yes — that is right!</p>
                ) : (
                  <p className="font-bold">
                    Not this time. The answer is {currentQuestion.answer}.
                  </p>
                )}
                <Button className="mt-3" onClick={() => void goNext()} disabled={saving}>
                  {saving
                    ? "Saving…"
                    : step === LESSON_SIZE
                      ? "See your score"
                      : "Next question"}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <p className="text-muted-foreground">Loading lesson…</p>
        </AppShell>
      }
    >
      <LessonInner />
    </Suspense>
  );
}
