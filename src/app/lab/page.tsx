"use client";

import { useEffect, useReducer } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Play, Check, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { STAGES, TOPICS, getTopic, topicsForStage } from "@/lib/curriculum";
import { isTopicPlayable } from "@/lib/questions/bank";
import { ADVANCE_MARK, RETRY_MARK } from "@/lib/questions/types";
import { clearLessonSession, loadLessonSession } from "@/lib/progress";
import { useHasMounted } from "@/lib/use-has-mounted";

export default function LabPage() {
  const router = useRouter();
  const mounted = useHasMounted();
  const { student, loading } = useAuth();
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const session = mounted ? loadLessonSession() : null;
  const resumeTopicId =
    student && session && session.studentId === student.id
      ? session.topicId
      : null;
  const currentTopic = student ? getTopic(student.currentTopicId) : undefined;
  const retryReady =
    student && currentTopic
      ? student.pendingRetryTopicId === currentTopic.id
      : false;

  useEffect(() => {
    if (!loading && !student) router.replace("/");
  }, [loading, student, router]);

  if (loading || !mounted || !student || !currentTopic) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Loading your path…</p>
      </AppShell>
    );
  }

  const playable = isTopicPlayable(currentTopic.id);
  const passedCount = student.unlockedTopicIds.length - 1;

  return (
    <AppShell>
      <div className="space-y-7">
        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-wide text-primary">
            {student.name}&apos;s path
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            One colourful topic at a time
          </h1>
          <p className="max-w-2xl text-muted-foreground leading-relaxed">
            {passedCount === 0
              ? `You are on the first Preschool topic. A lesson is 20 questions. Score ${ADVANCE_MARK} to move on, or ${RETRY_MARK}–18 to earn a retry.`
              : `You have unlocked ${student.unlockedTopicIds.length} of ${TOPICS.length} topics.`}
          </p>
        </div>

        <Card className="border-primary/25 bg-gradient-to-br from-card to-muted">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Current topic</Badge>
              <Badge variant="outline">{currentTopic.code}</Badge>
              <Badge variant="soft">{currentTopic.strand}</Badge>
              {retryReady ? (
                <Badge variant="secondary">Retry chance</Badge>
              ) : null}
            </div>
            <CardTitle className="mt-2">{currentTopic.title}</CardTitle>
            <CardDescription>{currentTopic.summary}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            {playable ? (
              <>
                <Button asChild size="lg">
                  <Link href={`/lesson?topic=${currentTopic.id}&fresh=1`}>
                    <Play className="size-5" />
                    {retryReady ? "Retry this topic" : "Start a new lesson"}
                  </Link>
                </Button>
                {resumeTopicId === currentTopic.id ? (
                  <Button asChild size="lg" variant="outline">
                    <Link href={`/lesson?topic=${currentTopic.id}&resume=1`}>
                      Resume this lesson
                    </Link>
                  </Button>
                ) : null}
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-foreground">
                  You unlocked this topic. Its 1000-question bank is not in the
                  MVP yet — only <strong>Counting objects 1 to 10</strong> is
                  fully playable. You can retry that topic any time.
                </p>
                <Button asChild variant="outline">
                  <Link href="/lesson?topic=ps-count-1-10&fresh=1">
                    Practise counting again
                  </Link>
                </Button>
              </div>
            )}
            {resumeTopicId && resumeTopicId !== currentTopic.id ? (
              <Button
                variant="ghost"
                onClick={() => {
                  clearLessonSession();
                  bump();
                }}
              >
                Discard unfinished lesson
              </Button>
            ) : null}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {STAGES.map((stage) => {
            const topics = topicsForStage(stage.id);
            return (
              <section key={stage.id} className="space-y-3">
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    {stage.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {stage.ages} · {stage.cambridge}
                  </p>
                </div>
                <div className="grid gap-3">
                  {topics.map((topic) => {
                    const unlocked = student.unlockedTopicIds.includes(topic.id);
                    const current = student.currentTopicId === topic.id;
                    const mastered =
                      unlocked && student.currentTopicId !== topic.id;
                    return (
                      <div
                        key={topic.id}
                        className="flex items-start gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3"
                      >
                        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-sm">
                          {mastered ? (
                            <Check className="size-4 text-primary" />
                          ) : unlocked ? (
                            <Sparkles className="size-4 text-primary" />
                          ) : (
                            <Lock className="size-4 text-muted-foreground" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold leading-tight">
                              {topic.title}
                            </p>
                            {current ? <Badge variant="soft">Now</Badge> : null}
                            {topic.playable ? (
                              <Badge variant="outline">1000 questions</Badge>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {topic.code} · {topic.summary}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Separator />
              </section>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
