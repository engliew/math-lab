import { NextResponse } from "next/server";
import { createSession, loginUser } from "@/lib/server/auth";
import { jsonError, readErrorMessage } from "@/lib/server/http";
import { loadStudent } from "@/lib/server/progress";
import { setSessionCookie } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };
    const user = loginUser({
      username: body.username ?? "",
      password: body.password ?? "",
    });
    const token = createSession(user.id);
    await setSessionCookie(token);
    const student = loadStudent(user.id);
    return NextResponse.json({ student });
  } catch (error) {
    return jsonError(readErrorMessage(error, "Could not log in."), 401);
  }
}
