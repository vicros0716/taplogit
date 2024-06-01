import { SQLiteDatabase } from 'expo-sqlite';

const MIGRATIONS: string[] = [
    `PRAGMA journal_mode = 'wal';`,
    `
        CREATE TABLE its
        (
            it_id       INTEGER PRIMARY KEY NOT NULL,
            created_at  INTEGER             NOT NULL DEFAULT (unixepoch()),
            deleted_at  INTEGER,
            name        TEXT                NOT NULL,
            coalesce_by TEXT                NOT NULL DEFAULT 'day'
        );
        CREATE TABLE taps
        (
            tap_id    INTEGER PRIMARY KEY NOT NULL,
            it_id     INTEGER             NOT NULL REFERENCES its,
            tapped_at INTEGER             NOT NULL DEFAULT (unixepoch())
        );
        CREATE INDEX taps_its_index ON taps (it_id);
        CREATE TABLE it_widgets
        (
            widget_id INTEGER PRIMARY KEY NOT NULL,
            it_id     INTEGER             NOT NULL REFERENCES its
        );
        CREATE INDEX it_widgets_its_index ON it_widgets (it_id);
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
