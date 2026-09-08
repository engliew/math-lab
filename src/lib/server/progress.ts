import { randomUUID } from "node:crypto";
import { FIRST_TOPIC_ID, getTopic } from "@/lib/curriculum";
import { applyLessonToProgress } from "@/lib/progression";
import { createLesson, scoreLesson } from "@/lib/lesson";
import { isTopicPlayable } from "@/lib/questions/bank";
import { getDb } from "@/lib/server/db";
import type { LessonRecord, Student } from "@/lib/student";
import type { ProgressionOutcome } from "@/lib/progression";

type ProgressRow = {
  user_id: string;
  current_topic_id: string;
  unlocked_topic_ids: string;
  best_by_topic: string;
  pending_retry_topic_id: string | null;
  updated_at: string;
};

type UserLite = {
  id: string;
  username: string;
  display_name: string;
};

type LessonRow = {
  topic_id: string;
  seed: number;
  correct: number;
  total: number;
  advanced: number;
  outcome: string;
  at: string;
};

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadStudent(userId: string): Student | null {
  const db = getDb();
  const user = db
    .prepare("SELECT id, username, display_name FROM users WHERE id = ?")
    .get(userId) as UserLite | undefined;
  if (!user) return null;

  let progress = db
    .prepare("SELECT * FROM progress WHERE user_id = ?")
    .get(userId) as ProgressRow | undefined;
  if (!progress) {
    const now = new Date().toISOString();
    db.prepare(
      `INSERT INTO progress (
        user_id, current_topic_id, unlocked_topic_ids, best_by_topic,
        pending_retry_topic_id, updated_at
      ) VALUES (?, ?, ?, ?, NULL, ?)`,
    ).run(userId, FIRST_TOPIC_ID, JSON.stringify([FIRST_TOPIC_ID]), "{}", now);
    progress = db
      .prepare("SELECT * FROM progress WHERE user_id = ?")
      .get(userId) as ProgressRow;
  }

  const lessons = (
    db
      .prepare(
        "SELECT topic_id, seed, correct, total, advanced, outcome, at FROM lessons WHERE user_id = ? ORDER BY at ASC",
      )
      .all(userId) as LessonRow[]
  ).map(
    (row): LessonRecord => ({
      topicId: row.topic_id,
      seed: row.seed,
      correct: row.correct,
      total: row.total,
      advanced: Boolean(row.advanced),
      outcome: row.outcome as ProgressionOutcome,
      at: row.at,
    }),
  );

  return {
    id: user.id,
    username: user.username,
    name: user.display_name,
    currentTopicId: progress.current_topic_id,
    unlockedTopicIds: parseJson<string[]>(progress.unlocked_topic_ids, [
      FIRST_TOPIC_ID,
    ]),
    bestByTopic: parseJson<Record<string, number>>(progress.best_by_topic, {}),
    pendingRetryTopicId: progress.pending_retry_topic_id,
    lessons,
  };
}

export function completeLesson(input: {
  userId: string;
  topicId: string;
  seed: number;
  answers: Array<string | null>;
}): {
  student: Student;
  correct: number;
  total: number;
  advanced: boolean;
  outcome: ProgressionOutcome;
  nextTopicId: string | null;
  pendingRetry: boolean;
} {
  const student = loadStudent(input.userId);
  if (!student) throw new Error("Student not found");

  const topic = getTopic(input.topicId);
  if (!topic) throw new Error("That topic is not on the path.");
  if (!isTopicPlayable(input.topicId)) {
    throw new Error("This topic does not have a question bank yet.");
  }
  if (!student.unlockedTopicIds.includes(input.topicId)) {
    throw new Error("This topic is still locked.");
  }

  const plan = createLesson(input.topicId, input.seed);
  const scored = scoreLesson(plan.questions, input.answers);
  const applied = applyLessonToProgress(student, {
    topicId: input.topicId,
    correct: scored.correct,
  });

  const now = new Date().toISOString();
  const db = getDb();
  db.exec("BEGIN");
  try {
    db.prepare(
      `INSERT INTO lessons (
        id, user_id, topic_id, seed, correct, total, advanced, outcome, at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      randomUUID(),
      input.userId,
      input.topicId,
      input.seed,
      scored.correct,
      scored.total,
      applied.advanced ? 1 : 0,
      applied.outcome,
      now,
    );
    db.prepare(
      `UPDATE progress SET
        current_topic_id = ?,
        unlocked_topic_ids = ?,
        best_by_topic = ?,
        pending_retry_topic_id = ?,
        updated_at = ?
      WHERE user_id = ?`,
    ).run(
      applied.snapshot.currentTopicId,
      JSON.stringify(applied.snapshot.unlockedTopicIds),
      JSON.stringify(applied.snapshot.bestByTopic),
      applied.snapshot.pendingRetryTopicId,
      now,
      input.userId,
    );
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  const next = loadStudent(input.userId);
  if (!next) throw new Error("Student not found after save");

  return {
    student: next,
    correct: scored.correct,
    total: scored.total,
    advanced: applied.advanced,
    outcome: applied.outcome,
    nextTopicId: applied.nextTopicId,
    pendingRetry: applied.snapshot.pendingRetryTopicId === input.topicId,
  };
}
