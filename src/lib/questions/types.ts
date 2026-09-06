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
export const LESSON_SIZE = 50;
export const PASS_MARK = 45;
