import type { ProgressionOutcome } from "@/lib/progression";

export type LessonRecord = {
  topicId: string;
  seed: number;
  correct: number;
  total: number;
  advanced: boolean;
  outcome: ProgressionOutcome;
  at: string;
};

export type Student = {
  id: string;
  username: string;
  name: string;
  currentTopicId: string;
  unlockedTopicIds: string[];
  lessons: LessonRecord[];
  bestByTopic: Record<string, number>;
  pendingRetryTopicId: string | null;
};

export type LessonSession = {
  studentId: string;
  topicId: string;
  seed: number;
  indices: number[];
  answers: Array<string | null>;
  current: number;
  startedAt: string;
};

export type LessonResult = {
  studentId: string;
  topicId: string;
  seed: number;
  correct: number;
  total: number;
  advanced: boolean;
  outcome: ProgressionOutcome;
  nextTopicId: string | null;
  pendingRetry: boolean;
  at: string;
};
