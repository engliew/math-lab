import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createLesson } from "@/lib/lesson";
import { PRESCHOOL_COUNTING_ID } from "@/lib/questions/preschool-counting";

process.env.MATHLAB_DATA_DIR = mkdtempSync(join(tmpdir(), "mathlab-test-"));

async function main() {
  const { registerUser, loginUser, createSession, userIdFromSession } =
    await import("@/lib/server/auth");
  const { completeLesson, loadStudent } = await import("@/lib/server/progress");
  const { dbPath } = await import("@/lib/server/db");

  const created = registerUser({
    username: "Amina_1",
    displayName: "Amina",
    password: "secret1",
  });
  assert.equal(created.username, "amina_1");

  try {
    registerUser({
      username: "amina_1",
      displayName: "Amina",
      password: "secret1",
    });
    assert.fail("duplicate username should fail");
  } catch (error) {
    assert.match((error as Error).message, /already taken/);
  }

  const loggedIn = loginUser({ username: "Amina_1", password: "secret1" });
  assert.equal(loggedIn.id, created.id);

  try {
    loginUser({ username: "Amina_1", password: "wrong" });
    assert.fail("bad password should fail");
  } catch (error) {
    assert.match((error as Error).message, /does not match/);
  }

  const token = createSession(created.id);
  assert.equal(userIdFromSession(token), created.id);

  const before = loadStudent(created.id);
  assert.equal(before?.currentTopicId, PRESCHOOL_COUNTING_ID);

  const first = createLesson(PRESCHOOL_COUNTING_ID, 42);
  const sixteen = first.questions.map((question, index) =>
    index < 4 ? "999" : question.answer,
  );
  const retry = completeLesson({
    userId: created.id,
    topicId: PRESCHOOL_COUNTING_ID,
    seed: 42,
    answers: sixteen,
  });
  assert.equal(retry.correct, 16);
  assert.equal(retry.advanced, false);
  assert.equal(retry.outcome, "retry-ready");
  assert.equal(retry.pendingRetry, true);
  assert.equal(retry.student.currentTopicId, PRESCHOOL_COUNTING_ID);

  const second = createLesson(PRESCHOOL_COUNTING_ID, 99);
  const fifteen = second.questions.map((question, index) =>
    index < 5 ? "999" : question.answer,
  );
  const advanced = completeLesson({
    userId: created.id,
    topicId: PRESCHOOL_COUNTING_ID,
    seed: 99,
    answers: fifteen,
  });
  assert.equal(advanced.correct, 15);
  assert.equal(advanced.advanced, true);
  assert.equal(advanced.nextTopicId, "ps-next-number");
  assert.equal(advanced.student.currentTopicId, "ps-next-number");
  assert.ok(advanced.student.unlockedTopicIds.includes("ps-next-number"));

  const again = loadStudent(created.id);
  assert.equal(again?.currentTopicId, "ps-next-number");
  assert.equal(again?.lessons.length, 2);

  console.log(`Math Lab persist tests passed (${dbPath()}).`);
}

void main();
