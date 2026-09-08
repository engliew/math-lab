import type { LessonResult, LessonSession } from "@/lib/student";

export const LESSON_SESSION_KEY = "math-lab-lesson-session";
export const LESSON_RESULT_KEY = "math-lab-lesson-result";

export type { LessonResult, LessonSession };

export function saveLessonSession(session: LessonSession) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(LESSON_SESSION_KEY, JSON.stringify(session));
}

export function loadLessonSession(): LessonSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(LESSON_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LessonSession;
  } catch {
    return null;
  }
}

export function clearLessonSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(LESSON_SESSION_KEY);
}

export function saveLessonResult(result: LessonResult) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(LESSON_RESULT_KEY, JSON.stringify(result));
}

export function loadLessonResult(): LessonResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(LESSON_RESULT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LessonResult;
  } catch {
    return null;
  }
}

export function newLessonSeed(): number {
  return Math.floor(Math.random() * 0xffffffff) >>> 0;
}
