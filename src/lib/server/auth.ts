import { randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { FIRST_TOPIC_ID } from "@/lib/curriculum";
import { getDb } from "@/lib/server/db";

export const SESSION_COOKIE = "mathlab_session";
export const SESSION_DAYS = 60;

export type UserRow = {
  id: string;
  username: string;
  display_name: string;
  password_hash: string;
  created_at: string;
};

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export function normaliseUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

export function validateUsername(raw: string): string {
  const username = normaliseUsername(raw);
  if (!USERNAME_RE.test(username)) {
    throw new Error(
      "Username must be 3–20 letters, numbers, or underscores.",
    );
  }
  return username;
}

export function validateDisplayName(raw: string): string {
  const name = raw.trim().replace(/\s+/g, " ");
  if (name.length < 2) {
    throw new Error("Please type a name with at least 2 letters.");
  }
  if (name.length > 40) {
    throw new Error("That name is a bit long — try a shorter one.");
  }
  return name;
}

export function validatePassword(raw: string): string {
  if (raw.length < 6) {
    throw new Error("Password needs at least 6 characters.");
  }
  if (raw.length > 200) {
    throw new Error("That password is too long.");
  }
  return raw;
}

function newId(): string {
  return randomUUID();
}

export function registerUser(input: {
  username: string;
  displayName: string;
  password: string;
}): { id: string; username: string; name: string } {
  const username = validateUsername(input.username);
  const displayName = validateDisplayName(input.displayName);
  const password = validatePassword(input.password);
  const db = getDb();

  const existing = db
    .prepare("SELECT id FROM users WHERE username = ?")
    .get(username) as { id: string } | undefined;
  if (existing) {
    throw new Error("That username is already taken. Try another, or log in.");
  }

  const id = newId();
  const now = new Date().toISOString();
  const passwordHash = bcrypt.hashSync(password, 10);

  db.exec("BEGIN");
  try {
    db.prepare(
      "INSERT INTO users (id, username, display_name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
    ).run(id, username, displayName, passwordHash, now);
    db.prepare(
      `INSERT INTO progress (
        user_id, current_topic_id, unlocked_topic_ids, best_by_topic,
        pending_retry_topic_id, updated_at
      ) VALUES (?, ?, ?, ?, NULL, ?)`,
    ).run(
      id,
      FIRST_TOPIC_ID,
      JSON.stringify([FIRST_TOPIC_ID]),
      JSON.stringify({}),
      now,
    );
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return { id, username, name: displayName };
}

export function loginUser(input: {
  username: string;
  password: string;
}): { id: string; username: string; name: string } {
  const username = normaliseUsername(input.username);
  const db = getDb();
  const user = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username) as UserRow | undefined;
  if (!user || !bcrypt.compareSync(input.password, user.password_hash)) {
    throw new Error("Username or password does not match.");
  }
  return { id: user.id, username: user.username, name: user.display_name };
}

export function createSession(userId: string): string {
  const token = randomBytes(32).toString("hex");
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  getDb()
    .prepare(
      "INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
    )
    .run(token, userId, now.toISOString(), expires.toISOString());
  return token;
}

export function userIdFromSession(token: string | undefined | null): string | null {
  if (!token) return null;
  const row = getDb()
    .prepare(
      "SELECT user_id, expires_at FROM sessions WHERE token = ?",
    )
    .get(token) as { user_id: string; expires_at: string } | undefined;
  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) {
    getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return null;
  }
  return row.user_id;
}

export function destroySession(token: string | undefined | null) {
  if (!token) return;
  getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}
