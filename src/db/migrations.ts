import { SQLiteDatabase } from 'expo-sqlite';

const MIGRATIONS: string[] = [
    `PRAGMA journal_mode = 'wal';`,
    `
        CREATE TABLE its
        (
            it_id       INTEGER PRIMARY KEY                                 NOT NULL,
            created_at  INTEGER                                             NOT NULL DEFAULT (unixepoch()),
            deleted_at  INTEGER,
            name        TEXT                                                NOT NULL,
            type        TEXT CHECK (type IN ('tap', 'switch'))              NOT NULL DEFAULT 'tap',
            coalesce_by TEXT CHECK (coalesce_by IN ('week', 'day', 'hour')) NOT NULL DEFAULT 'day'
        );

        CREATE TABLE taps
        (
            tap_id    INTEGER PRIMARY KEY NOT NULL,
            it_id     INTEGER             NOT NULL REFERENCES its,
            tapped_at INTEGER             NOT NULL DEFAULT (unixepoch())
        );
        CREATE INDEX taps_its_index ON taps (it_id);

        CREATE VIEW its_latest_tap
                    (it_id, created_at, deleted_at, name, type, coalesce_by, latest_tapped_at) AS
        SELECT its.it_id,
               its.created_at,
               its.deleted_at,
               its.name,
               its.type,
               its.coalesce_by,
               MAX(taps.tapped_at)
        FROM its
                 LEFT JOIN taps USING (it_id)
        GROUP BY its.it_id;

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
