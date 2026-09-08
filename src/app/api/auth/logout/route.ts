import { NextResponse } from "next/server";
import { destroySession } from "@/lib/server/auth";
import { clearSessionCookie, readSessionToken } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const token = await readSessionToken();
  destroySession(token);
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
