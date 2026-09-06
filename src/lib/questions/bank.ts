import { getTopic } from "@/lib/curriculum";
import {
  generatePreschoolCounting,
  PRESCHOOL_COUNTING_ID,
} from "@/lib/questions/preschool-counting";
import { BANK_SIZE, type Question } from "@/lib/questions/types";

export function isTopicPlayable(topicId: string): boolean {
  return getTopic(topicId)?.playable === true;
}

export function generateQuestion(topicId: string, index: number): Question {
  if (topicId === PRESCHOOL_COUNTING_ID) {
    return generatePreschoolCounting(index);
  }
  throw new Error(`No question bank yet for topic ${topicId}`);
}

export function generateBank(topicId: string): Question[] {
  return Array.from({ length: BANK_SIZE }, (_, index) =>
    generateQuestion(topicId, index),
  );
}
