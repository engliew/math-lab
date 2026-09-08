import { getNextTopic } from "@/lib/curriculum";
import { ADVANCE_MARK, RETRY_MARK } from "@/lib/questions/types";

export type ProgressionOutcome = "advance" | "retry-ready" | "stay";

export type AttemptDecision = {
  advance: boolean;
  pendingRetry: boolean;
  outcome: ProgressionOutcome;
};

/**
 * Topic-set progression (20 questions):
 * - ≥19/20 → advance
 * - 15–18/20 on a first attempt → stay and earn one retry
 * - on that retry, ≥15/20 → advance
 * - below those bands → stay; a failed retry clears the retry privilege
 */
export function evaluateAttempt(
  correct: number,
  pendingRetry: boolean,
): AttemptDecision {
  if (correct >= ADVANCE_MARK) {
    return { advance: true, pendingRetry: false, outcome: "advance" };
  }
  if (pendingRetry && correct >= RETRY_MARK) {
    return { advance: true, pendingRetry: false, outcome: "advance" };
  }
  if (!pendingRetry && correct >= RETRY_MARK) {
    return { advance: false, pendingRetry: true, outcome: "retry-ready" };
  }
  return { advance: false, pendingRetry: false, outcome: "stay" };
}

export type ProgressSnapshot = {
  currentTopicId: string;
  unlockedTopicIds: string[];
  bestByTopic: Record<string, number>;
  pendingRetryTopicId: string | null;
};

export type LessonApplication = {
  snapshot: ProgressSnapshot;
  advanced: boolean;
  nextTopicId: string | null;
  outcome: ProgressionOutcome;
};

export function applyLessonToProgress(
  snapshot: ProgressSnapshot,
  input: { topicId: string; correct: number },
): LessonApplication {
  const bestByTopic = {
    ...snapshot.bestByTopic,
    [input.topicId]: Math.max(
      snapshot.bestByTopic[input.topicId] ?? 0,
      input.correct,
    ),
  };

  if (input.topicId !== snapshot.currentTopicId) {
    return {
      snapshot: { ...snapshot, bestByTopic },
      advanced: false,
      nextTopicId: null,
      outcome: "stay",
    };
  }

  const pendingRetry = snapshot.pendingRetryTopicId === input.topicId;
  const decision = evaluateAttempt(input.correct, pendingRetry);

  if (!decision.advance) {
    return {
      snapshot: {
        ...snapshot,
        bestByTopic,
        pendingRetryTopicId: decision.pendingRetry ? input.topicId : null,
      },
      advanced: false,
      nextTopicId: null,
      outcome: decision.outcome,
    };
  }

  const next = getNextTopic(input.topicId);
  const unlockedTopicIds = snapshot.unlockedTopicIds.slice();
  if (next && !unlockedTopicIds.includes(next.id)) {
    unlockedTopicIds.push(next.id);
  }

  return {
    snapshot: {
      currentTopicId: next?.id ?? input.topicId,
      unlockedTopicIds,
      bestByTopic,
      pendingRetryTopicId: null,
    },
    advanced: true,
    nextTopicId: next?.id ?? null,
    outcome: "advance",
  };
}

export function outcomeCopy(outcome: ProgressionOutcome): string {
  if (outcome === "advance") {
    return "You unlocked the next topic.";
  }
  if (outcome === "retry-ready") {
    return "Almost! Retry this topic. Score 15 or more on the retry to move on.";
  }
  return "Keep practising this topic. Score 19 to move on, or 15–18 to earn a retry.";
}
