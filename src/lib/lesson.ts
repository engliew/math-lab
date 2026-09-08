import { getNextTopic, getTopic } from "@/lib/curriculum";
import { sampleIndices } from "@/lib/rng";
import { answersMatch } from "@/lib/answers";
import { generateQuestion } from "@/lib/questions/bank";
import {
  ADVANCE_MARK,
  BANK_SIZE,
  LESSON_SIZE,
  RETRY_MARK,
  type Question,
} from "@/lib/questions/types";

export type LessonPlan = {
  topicId: string;
  seed: number;
  indices: number[];
  questions: Question[];
};

export function createLesson(topicId: string, seed: number): LessonPlan {
  const topic = getTopic(topicId);
  if (!topic) throw new Error(`Unknown topic ${topicId}`);
  if (!topic.playable) {
    throw new Error(`Topic ${topicId} does not have a question bank yet`);
  }

  const indices = sampleIndices(seed, BANK_SIZE, LESSON_SIZE);
  return {
    topicId,
    seed,
    indices,
    questions: indices.map((index) => generateQuestion(topicId, index)),
  };
}

export function markAnswer(question: Question, given: string): boolean {
  return answersMatch(given, question.answer, question.accept);
}

export function scoreLesson(
  questions: Question[],
  answers: Array<string | null>,
): { correct: number; total: number } {
  let correct = 0;
  for (let i = 0; i < questions.length; i += 1) {
    const given = answers[i];
    if (given != null && markAnswer(questions[i]!, given)) {
      correct += 1;
    }
  }
  return {
    correct,
    total: questions.length,
  };
}

export function nextTopicAfterPass(topicId: string) {
  return getNextTopic(topicId);
}

export { ADVANCE_MARK, BANK_SIZE, LESSON_SIZE, RETRY_MARK };
