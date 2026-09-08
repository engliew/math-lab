"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/auth-provider";
import { CountBuddy, StarBurst } from "@/components/playful-bits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTopic } from "@/lib/curriculum";
import { isTopicPlayable } from "@/lib/questions/bank";
import { ADVANCE_MARK, RETRY_MARK } from "@/lib/questions/types";
import { outcomeCopy } from "@/lib/progression";
import { loadLessonResult } from "@/lib/progress";
import { useHasMounted } from "@/lib/use-has-mounted";

export default function ResultsPage() {
  const router = useRouter();
  const mounted = useHasMounted();
  const { student, loading } = useAuth();
  const result = mounted ? loadLessonResult() : null;

  useEffect(() => {
    if (mounted && !loading && !student) router.replace("/");
  }, [mounted, loading, student, router]);

  if (!mounted || loading) {
    return (
      <AppShell>
        <p className="text-muted-foreground">Adding up your score…</p>
      </AppShell>
    );
  }

  if (!result) {
    return (
      <AppShell>
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle>No lesson to score yet</CardTitle>
            <CardDescription>
              Finish a lesson of 20 questions to see whether you move on.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/lab">Back to the path</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const topic = getTopic(result.topicId);
  const next = result.nextTopicId ? getTopic(result.nextTopicId) : undefined;
  const nextPlayable = next ? isTopicPlayable(next.id) : false;

  return (
    <AppShell>
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="items-center text-center">
          {result.advanced ? (
            <StarBurst className="h-12 w-12" />
          ) : (
            <CountBuddy className="h-16 w-20" />
          )}
          <Badge
            variant={result.advanced ? "default" : result.outcome === "retry-ready" ? "soft" : "secondary"}
            className="mx-auto w-fit"
          >
            {result.advanced
              ? "Next topic unlocked"
              : result.outcome === "retry-ready"
                ? "Retry earned"
                : "Same topic again"}
          </Badge>
          <CardTitle className="mt-3 text-4xl">
            {result.correct} / {result.total}
          </CardTitle>
          <CardDescription>
            {topic?.title ?? "Lesson"} · 20 questions · {ADVANCE_MARK} to fly,
            {" "}
            {RETRY_MARK}–18 for a retry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-center leading-relaxed font-semibold">
            {outcomeCopy(result.outcome)}
            {result.advanced && next ? ` Next up: ${next.title}.` : null}
          </p>

          <div className="flex flex-col gap-2">
            {result.advanced && next && nextPlayable ? (
              <Button asChild size="lg">
                <Link href={`/lesson?topic=${next.id}`}>Start {next.title}</Link>
              </Button>
            ) : null}
            {result.advanced && next && !nextPlayable ? (
              <Button asChild size="lg">
                <Link href="/lab">See your unlocked path</Link>
              </Button>
            ) : null}
            {!result.advanced ? (
              <Button asChild size="lg">
                <Link href={`/lesson?topic=${result.topicId}&fresh=1`}>
                  {result.outcome === "retry-ready"
                    ? "Start your retry"
                    : "Try this topic again"}
                </Link>
              </Button>
            ) : null}
            {result.advanced ? (
              <Button asChild variant="outline">
                <Link href={`/lesson?topic=${result.topicId}&fresh=1`}>
                  Practise this topic again
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="ghost">
              <Link href="/lab">Back to the path</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
