export type Visual =
  | { type: "tenFrame"; count: number }
  | { type: "twoFrames"; left: number; right: number }
  | { type: "sequence"; items: Array<number | null> };

export type Question = {
  id: string;
  index: number;
  topicId: string;
  prompt: string;
  kind: "number" | "choice";
  options?: string[];
  answer: string;
  accept?: string[];
  visual?: Visual;
  spoken?: string;
};

export const BANK_SIZE = 1000;
export const LESSON_SIZE = 20;
/** First attempt: this many correct unlocks the next topic. */
export const ADVANCE_MARK = 19;
/** After a 15–18 first attempt, this many correct on the retry unlocks the next topic. */
export const RETRY_MARK = 15;
