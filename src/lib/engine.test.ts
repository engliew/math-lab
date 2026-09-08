import assert from "node:assert/strict";
import { FIRST_TOPIC_ID, getNextTopic, TOPICS } from "@/lib/curriculum";
import { answersMatch } from "@/lib/answers";
import { generateBank, generateQuestion } from "@/lib/questions/bank";
import { createLesson, scoreLesson } from "@/lib/lesson";
import {
  applyLessonToProgress,
  evaluateAttempt,
} from "@/lib/progression";
import {
  ADVANCE_MARK,
  BANK_SIZE,
  LESSON_SIZE,
  RETRY_MARK,
} from "@/lib/questions/types";
import { PRESCHOOL_COUNTING_ID } from "@/lib/questions/preschool-counting";

function testCurriculum() {
  assert.equal(TOPICS[0]?.id, "ps-count-1-10");
  assert.equal(FIRST_TOPIC_ID, PRESCHOOL_COUNTING_ID);
  assert.ok(TOPICS.filter((t) => t.stageId === "preschool").length >= 8);
  assert.ok(TOPICS.some((t) => t.stageId === "y6"));
  assert.equal(TOPICS.filter((t) => t.playable).length, 1);
  const codes = TOPICS.map((t) => t.code);
  assert.ok(codes.includes("1Nc.01"));
  assert.ok(codes.includes("6Ss.03"));
  assert.ok(codes.every((code, i) => codes.indexOf(code) === i));
  assert.ok(TOPICS.some((t) => t.code.startsWith("EY.")));
}

function testBank() {
  const bank = generateBank(PRESCHOOL_COUNTING_ID);
  assert.equal(bank.length, BANK_SIZE);

  const ids = new Set(bank.map((q) => q.id));
  assert.equal(ids.size, BANK_SIZE);

  for (const question of bank) {
    assert.ok(question.prompt.length > 0);
    assert.ok(question.answer.length > 0);
    assert.ok(answersMatch(question.answer, question.answer, question.accept));
    if (question.kind === "choice") {
      assert.ok(question.options?.includes(question.answer));
    }
  }

  const again = generateQuestion(PRESCHOOL_COUNTING_ID, 42);
  assert.deepEqual(again, bank[42]);
}

function testLessonSampling() {
  const lessonA = createLesson(PRESCHOOL_COUNTING_ID, 12345);
  const lessonB = createLesson(PRESCHOOL_COUNTING_ID, 12345);
  const lessonC = createLesson(PRESCHOOL_COUNTING_ID, 99999);

  assert.equal(LESSON_SIZE, 20);
  assert.equal(lessonA.questions.length, 20);
  assert.deepEqual(lessonA.indices, lessonB.indices);
  assert.notDeepEqual(lessonA.indices, lessonC.indices);
  assert.equal(new Set(lessonA.indices).size, LESSON_SIZE);
  assert.ok(lessonA.indices.every((i) => i >= 0 && i < BANK_SIZE));
}

function answersWithMisses(
  questions: { answer: string }[],
  misses: number,
): string[] {
  return questions.map((question, index) =>
    index < misses ? "999" : question.answer,
  );
}

function testScoringBands() {
  const lesson = createLesson(PRESCHOOL_COUNTING_ID, 7);
  const perfect = lesson.questions.map((q) => q.answer);
  const twenty = scoreLesson(lesson.questions, perfect);
  assert.equal(twenty.correct, 20);
  assert.equal(twenty.total, 20);

  const nineteen = scoreLesson(
    lesson.questions,
    answersWithMisses(lesson.questions, 1),
  );
  assert.equal(nineteen.correct, 19);

  const eighteen = scoreLesson(
    lesson.questions,
    answersWithMisses(lesson.questions, 2),
  );
  assert.equal(eighteen.correct, 18);

  const fifteen = scoreLesson(
    lesson.questions,
    answersWithMisses(lesson.questions, 5),
  );
  assert.equal(fifteen.correct, 15);

  const fourteen = scoreLesson(
    lesson.questions,
    answersWithMisses(lesson.questions, 6),
  );
  assert.equal(fourteen.correct, 14);
}

function testProgressionRules() {
  assert.equal(ADVANCE_MARK, 19);
  assert.equal(RETRY_MARK, 15);

  assert.deepEqual(evaluateAttempt(20, false), {
    advance: true,
    pendingRetry: false,
    outcome: "advance",
  });
  assert.deepEqual(evaluateAttempt(19, false), {
    advance: true,
    pendingRetry: false,
    outcome: "advance",
  });
  assert.deepEqual(evaluateAttempt(18, false), {
    advance: false,
    pendingRetry: true,
    outcome: "retry-ready",
  });
  assert.deepEqual(evaluateAttempt(15, false), {
    advance: false,
    pendingRetry: true,
    outcome: "retry-ready",
  });
  assert.deepEqual(evaluateAttempt(14, false), {
    advance: false,
    pendingRetry: false,
    outcome: "stay",
  });

  assert.deepEqual(evaluateAttempt(15, true), {
    advance: true,
    pendingRetry: false,
    outcome: "advance",
  });
  assert.deepEqual(evaluateAttempt(18, true), {
    advance: true,
    pendingRetry: false,
    outcome: "advance",
  });
  assert.deepEqual(evaluateAttempt(19, true), {
    advance: true,
    pendingRetry: false,
    outcome: "advance",
  });
  assert.deepEqual(evaluateAttempt(14, true), {
    advance: false,
    pendingRetry: false,
    outcome: "stay",
  });
}

function testApplyLessonToProgress() {
  const next = getNextTopic(PRESCHOOL_COUNTING_ID);
  assert.equal(next?.id, "ps-next-number");

  const start = {
    currentTopicId: PRESCHOOL_COUNTING_ID,
    unlockedTopicIds: [PRESCHOOL_COUNTING_ID],
    bestByTopic: {},
    pendingRetryTopicId: null as string | null,
  };

  const fly = applyLessonToProgress(start, {
    topicId: PRESCHOOL_COUNTING_ID,
    correct: 19,
  });
  assert.equal(fly.advanced, true);
  assert.equal(fly.nextTopicId, "ps-next-number");
  assert.ok(fly.snapshot.unlockedTopicIds.includes("ps-next-number"));

  const earnRetry = applyLessonToProgress(start, {
    topicId: PRESCHOOL_COUNTING_ID,
    correct: 16,
  });
  assert.equal(earnRetry.advanced, false);
  assert.equal(earnRetry.outcome, "retry-ready");
  assert.equal(earnRetry.snapshot.pendingRetryTopicId, PRESCHOOL_COUNTING_ID);
  assert.equal(earnRetry.snapshot.currentTopicId, PRESCHOOL_COUNTING_ID);

  const retryPass = applyLessonToProgress(earnRetry.snapshot, {
    topicId: PRESCHOOL_COUNTING_ID,
    correct: 15,
  });
  assert.equal(retryPass.advanced, true);
  assert.equal(retryPass.nextTopicId, "ps-next-number");
  assert.equal(retryPass.snapshot.pendingRetryTopicId, null);

  const retryFail = applyLessonToProgress(earnRetry.snapshot, {
    topicId: PRESCHOOL_COUNTING_ID,
    correct: 14,
  });
  assert.equal(retryFail.advanced, false);
  assert.equal(retryFail.outcome, "stay");
  assert.equal(retryFail.snapshot.pendingRetryTopicId, null);

  const stayLow = applyLessonToProgress(start, {
    topicId: PRESCHOOL_COUNTING_ID,
    correct: 10,
  });
  assert.equal(stayLow.advanced, false);
  assert.equal(stayLow.snapshot.pendingRetryTopicId, null);
}

function main() {
  testCurriculum();
  testBank();
  testLessonSampling();
  testScoringBands();
  testProgressionRules();
  testApplyLessonToProgress();
  console.log("Math Lab engine tests passed.");
}

main();
