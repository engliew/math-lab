import { NextResponse } from "next/server";
import { jsonError } from "@/lib/server/http";
import { currentStudent } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const student = await currentStudent();
  if (!student) return jsonError("Please log in.", 401);
  return NextResponse.json({ student });
}
