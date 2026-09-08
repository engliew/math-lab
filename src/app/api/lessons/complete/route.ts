import { NextResponse } from "next/server";
import { jsonError, readErrorMessage } from "@/lib/server/http";
import { completeLesson } from "@/lib/server/progress";
import { requireStudent } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const student = await requireStudent();
    const body = (await request.json()) as {
      topicId?: string;
      seed?: number;
      answers?: Array<string | null>;
    };
    if (!body.topicId || typeof body.seed !== "number" || !Array.isArray(body.answers)) {
      return jsonError("Lesson data is missing.", 400);
    }
    const result = completeLesson({
      userId: student.id,
      topicId: body.topicId,
      seed: body.seed,
      answers: body.answers,
    });
    return NextResponse.json({
      studentId: student.id,
      topicId: body.topicId,
      seed: body.seed,
      correct: result.correct,
      total: result.total,
      advanced: result.advanced,
      outcome: result.outcome,
      nextTopicId: result.nextTopicId,
      pendingRetry: result.pendingRetry,
      at: new Date().toISOString(),
      student: result.student,
    });
  } catch (error) {
    const message = readErrorMessage(error, "Could not save this lesson.");
    const status = message === "Please log in." ? 401 : 400;
    return jsonError(message, status);
  }
}
