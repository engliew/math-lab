import type { LessonResult, Student } from "@/lib/student";
import type { ProgressionOutcome } from "@/lib/progression";

async function readJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? "Something went wrong. Try again.");
  }
  return data;
}

export async function apiMe(): Promise<Student | null> {
  const response = await fetch("/api/auth/me", { credentials: "include" });
  if (response.status === 401) return null;
  const data = await readJson<{ student: Student }>(response);
  return data.student;
}

export async function apiRegister(input: {
  username: string;
  displayName: string;
  password: string;
}): Promise<Student> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await readJson<{ student: Student }>(response);
  return data.student;
}

export async function apiLogin(input: {
  username: string;
  password: string;
}): Promise<Student> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await readJson<{ student: Student }>(response);
  return data.student;
}

export async function apiLogout() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}

export async function apiCompleteLesson(input: {
  topicId: string;
  seed: number;
  answers: Array<string | null>;
}): Promise<LessonResult> {
  const response = await fetch("/api/lessons/complete", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await readJson<{
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
  }>(response);
  return { ...data };
}
