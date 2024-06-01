import { SQLiteDatabase } from 'expo-sqlite';

const MIGRATIONS: string[] = [
    `PRAGMA journal_mode = 'wal';`,
    `
      CREATE TABLE its
      (
          id         INTEGER PRIMARY KEY NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          deleted_at TEXT,
          name       TEXT                NOT NULL
      );
      CREATE TABLE taps
      (
          id         INTEGER PRIMARY KEY NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          its_id     INTEGER             NOT NULL REFERENCES its,
          tapped_at  TEXT                NOT NULL
      );
      CREATE INDEX taps_its_index ON taps (its_id);
  `,
    `
      ALTER TABLE its
          ADD COLUMN coalesce_by TEXT NOT NULL DEFAULT 'day'
  `,
];

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    let { user_version: currentDbVersion } = (await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version',
    )) ?? { user_version: 0 };

    const migrationsToRun = MIGRATIONS.slice(currentDbVersion);
    for await (const migration of migrationsToRun) {
        const i = MIGRATIONS.indexOf(migration);
        console.info(`Running migration ${i}`);
        console.debug(migration);
        await db.execAsync(migration);
        console.info(`Finished migration ${i}`);
    }

    await db.execAsync(`PRAGMA user_version = ${MIGRATIONS.length}`);
}
