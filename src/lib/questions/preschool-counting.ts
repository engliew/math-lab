import { hashSeed, mulberry32, pickOne, randInt } from "@/lib/rng";
import type { Question } from "@/lib/questions/types";

export const PRESCHOOL_COUNTING_ID = "ps-count-1-10";

const NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
] as const;

function distinctPair(rng: () => number): [number, number] {
  const left = randInt(rng, 1, 10);
  let right = randInt(rng, 1, 10);
  if (right === left) {
    right = left === 10 ? 9 : left + 1;
  }
  return [left, right];
}

/**
 * Deterministic bank of 1000 counting questions (indices 0–999).
 * Ten families × 100 items, all answers in 0–10.
 */
export function generatePreschoolCounting(index: number): Question {
  if (index < 0 || index > 999) {
    throw new RangeError(`Question index must be 0–999, got ${index}`);
  }

  const rng = mulberry32(hashSeed(PRESCHOOL_COUNTING_ID, index));
  const family = index % 10;
  const id = `${PRESCHOOL_COUNTING_ID}:${index}`;

  if (family === 0) {
    const count = 1 + Math.floor(index / 10) % 10;
    return {
      id,
      index,
      topicId: PRESCHOOL_COUNTING_ID,
      prompt: "How many counters are in the ten-frame?",
      kind: "number",
      answer: String(count),
      visual: { type: "tenFrame", count },
    };
  }

  if (family === 1) {
    const count = randInt(rng, 1, 10);
    return {
      id,
      index,
      topicId: PRESCHOOL_COUNTING_ID,
      prompt: `This ten-frame shows ${NUMBER_WORDS[count]}. What number is that?`,
      kind: "number",
      answer: String(count),
      accept: [NUMBER_WORDS[count]],
      visual: { type: "tenFrame", count },
    };
  }

  if (family === 2) {
    const n = randInt(rng, 0, 9);
    return {
      id,
      index,
      topicId: PRESCHOOL_COUNTING_ID,
      prompt: `What number comes after ${n}?`,
      kind: "number",
      answer: String(n + 1),
      accept: [NUMBER_WORDS[n + 1]],
    };
  }

  if (family === 3) {
    const n = randInt(rng, 1, 10);
    return {
      id,
      index,
      topicId: PRESCHOOL_COUNTING_ID,
      prompt: `What number comes before ${n}?`,
      kind: "number",
      answer: String(n - 1),
      accept: [NUMBER_WORDS[n - 1]],
    };
  }

  if (family === 4) {
    const start = randInt(rng, 1, 7);
    const missing = start + 1;
    return {
      id,
      index,
      topicId: PRESCHOOL_COUNTING_ID,
      prompt: "What number is missing in this count?",
      kind: "number",
      answer: String(missing),
      accept: [NUMBER_WORDS[missing]],
      visual: { type: "sequence", items: [start, null, start + 2, start + 3] },
    };
  }

  if (family === 5) {
    const [a, b] = distinctPair(rng);
    const bigger = Math.max(a, b);
    return {
      id,
      index,
      topicId: PRESCHOOL_COUNTING_ID,
      prompt: "Which ten-frame has more counters? Type that number.",
      kind: "number",
      answer: String(bigger),
      visual: { type: "twoFrames", left: a, right: b },
    };
  }

  if (family === 6) {
    const [a, b] = distinctPair(rng);
    const smaller = Math.min(a, b);
    return {
      id,
      index,
      topicId: PRESCHOOL_COUNTING_ID,
      prompt: "Which ten-frame has fewer counters? Type that number.",
      kind: "number",
      answer: String(smaller),
      visual: { type: "twoFrames", left: a, right: b },
    };
  }

  if (family === 7) {
    const n = randInt(rng, 0, 9);
    return {
      id,
      index,
      topicId: PRESCHOOL_COUNTING_ID,
      prompt: `What is one more than ${n}?`,
      kind: "number",
      answer: String(n + 1),
      accept: [NUMBER_WORDS[n + 1]],
    };
  }

  if (family === 8) {
    const n = randInt(rng, 1, 10);
    return {
      id,
      index,
      topicId: PRESCHOOL_COUNTING_ID,
      prompt: `What is one less than ${n}?`,
      kind: "number",
      answer: String(n - 1),
      accept: [NUMBER_WORDS[n - 1]],
    };
  }

  const target = randInt(rng, 1, 10);
  const distractors = new Set<number>();
  while (distractors.size < 3) {
    const extra = randInt(rng, 0, 10);
    if (extra !== target) distractors.add(extra);
  }
  const options = [target, ...distractors]
    .sort((x, y) => x - y)
    .map(String);
  const word = pickOne(rng, ["show", "make", "count"]);

  return {
    id,
    index,
    topicId: PRESCHOOL_COUNTING_ID,
    prompt: `Which number ${word}s ${NUMBER_WORDS[target]}?`,
    kind: "choice",
    options,
    answer: String(target),
    visual: { type: "tenFrame", count: target },
  };
}
