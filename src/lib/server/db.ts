import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";

export type Migration = {
  id: number;
  name: string;
  sql: string;
};

/**
 * Schema for student accounts and topic progress.
 * Applied automatically on first open, and by `npm run migrate`.
 *
 * Host path (Scott / EC2): MATHLAB_DATA_DIR=/opt/mathlab/data
 * File: /opt/mathlab/data/mathlab.sqlite
 */
export const MIGRATIONS: Migration[] = [
  {
    id: 1,
    name: "001_users_sessions_progress",
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS progress (
        user_id TEXT PRIMARY KEY,
        current_topic_id TEXT NOT NULL,
        unlocked_topic_ids TEXT NOT NULL,
        best_by_topic TEXT NOT NULL,
        pending_retry_topic_id TEXT,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        topic_id TEXT NOT NULL,
        seed INTEGER NOT NULL,
        correct INTEGER NOT NULL,
        total INTEGER NOT NULL,
        advanced INTEGER NOT NULL,
        outcome TEXT NOT NULL,
        at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_lessons_user ON lessons(user_id, at);
    `,
  },
];

let db: DatabaseSync | null = null;

export function dataDir(): string {
  return process.env.MATHLAB_DATA_DIR ?? join(process.cwd(), "data");
}

export function dbPath(): string {
  return join(dataDir(), "mathlab.sqlite");
}

export function applyMigrations(database: DatabaseSync) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL
    );
  `);

  const applied = new Set(
    (
      database.prepare("SELECT id FROM schema_migrations").all() as Array<{
        id: number;
      }>
    ).map((row) => row.id),
  );

  const insert = database.prepare(
    "INSERT INTO schema_migrations (id, name, applied_at) VALUES (?, ?, ?)",
  );

  for (const migration of MIGRATIONS) {
    if (applied.has(migration.id)) continue;
    database.exec("BEGIN");
    try {
      database.exec(migration.sql);
      insert.run(migration.id, migration.name, new Date().toISOString());
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
  }
}

export function getDb(): DatabaseSync {
  if (db) return db;
  mkdirSync(dataDir(), { recursive: true });
  db = new DatabaseSync(dbPath());
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  applyMigrations(db);
  return db;
}

export function closeDb() {
  db?.close();
  db = null;
}
