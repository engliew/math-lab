import { cookies } from "next/headers";
import {
  cookieOptions,
  SESSION_COOKIE,
  userIdFromSession,
} from "@/lib/server/auth";
import { loadStudent } from "@/lib/server/progress";
import type { Student } from "@/lib/student";

export async function readSessionToken(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value;
}

export async function currentStudent(): Promise<Student | null> {
  const token = await readSessionToken();
  const userId = userIdFromSession(token);
  if (!userId) return null;
  return loadStudent(userId);
}

export async function requireStudent(): Promise<Student> {
  const student = await currentStudent();
  if (!student) {
    throw new Error("Please log in.");
  }
  return student;
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, cookieOptions());
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
}
