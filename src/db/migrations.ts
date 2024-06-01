import { SQLiteDatabase } from 'expo-sqlite';

const MIGRATIONS: string[] = [
    `PRAGMA journal_mode = 'wal';`,
    `
        CREATE TABLE its
        (
            id          INTEGER PRIMARY KEY NOT NULL,
            created_at  INTEGER             NOT NULL DEFAULT (unixepoch()),
            deleted_at  INTEGER,
            name        TEXT                NOT NULL,
            coalesce_by TEXT                NOT NULL DEFAULT 'day'
        );
        CREATE TABLE taps
        (
            id        INTEGER PRIMARY KEY NOT NULL,
            its_id    INTEGER             NOT NULL REFERENCES its,
            tapped_at INTEGER             NOT NULL DEFAULT (unixepoch())
        );
        CREATE INDEX taps_its_index ON taps (its_id);
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
