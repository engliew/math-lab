import { dbPath, getDb, MIGRATIONS } from "../src/lib/server/db";

const db = getDb();
const rows = db.prepare("SELECT id, name FROM schema_migrations ORDER BY id").all() as Array<{
  id: number;
  name: string;
}>;

console.log(`Math Lab SQLite: ${dbPath()}`);
console.log(`Applied migrations (${rows.length}/${MIGRATIONS.length}):`);
for (const row of rows) {
  console.log(`  ${row.id} ${row.name}`);
}
console.log("Ready.");
