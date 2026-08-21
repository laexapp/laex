import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { emptyChapterTwoState, type ChapterTwoState, type ChapterTwoStore } from "../../chapter-two/types";

export class SqliteChapterTwoStore implements ChapterTwoStore {
  private readonly database: DatabaseSync;
  private queue: Promise<void> = Promise.resolve();

  constructor(path: string) {
    mkdirSync(dirname(path), { recursive: true });
    this.database = new DatabaseSync(path);
    this.database.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS business_state (id INTEGER PRIMARY KEY CHECK(id=1), payload TEXT NOT NULL, updated_at TEXT NOT NULL);");
    this.database.prepare("INSERT OR IGNORE INTO business_state(id,payload,updated_at) VALUES(1,?,?)").run(JSON.stringify(emptyChapterTwoState()), new Date().toISOString());
  }

  async transact<T>(operation: (draft: ChapterTwoState) => T | Promise<T>): Promise<T> {
    const previous = this.queue; let release!: () => void; this.queue = new Promise((resolve) => { release = resolve; }); await previous;
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const draft = this.read(); const result = await operation(draft);
      this.database.prepare("UPDATE business_state SET payload=?,updated_at=? WHERE id=1").run(JSON.stringify(draft), new Date().toISOString());
      this.database.exec("COMMIT"); return structuredClone(result);
    } catch (error) { this.database.exec("ROLLBACK"); throw error; } finally { release(); }
  }
  async snapshot() { return structuredClone(this.read()); }
  close() { this.database.close(); }
  private read(): ChapterTwoState { const row = this.database.prepare("SELECT payload FROM business_state WHERE id=1").get() as { payload: string }; const parsed = JSON.parse(row.payload) as Partial<ChapterTwoState>; return { ...emptyChapterTwoState(), ...parsed }; }
}
