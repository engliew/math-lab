import { NextResponse } from "next/server";
import { createSession, registerUser } from "@/lib/server/auth";
import { jsonError, readErrorMessage } from "@/lib/server/http";
import { loadStudent } from "@/lib/server/progress";
import { setSessionCookie } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      displayName?: string;
      password?: string;
    };
    const created = registerUser({
      username: body.username ?? "",
      displayName: body.displayName ?? "",
      password: body.password ?? "",
    });
    const token = createSession(created.id);
    await setSessionCookie(token);
    const student = loadStudent(created.id);
    return NextResponse.json({ student });
  } catch (error) {
    const message = readErrorMessage(error, "Could not register.");
    const status = message.includes("already taken") ? 409 : 400;
    return jsonError(message, status);
  }
}
