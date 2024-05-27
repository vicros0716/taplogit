import {SQLiteDatabase} from "expo-sqlite";

type Migration = SQLQuery[];
type SQLQuery = (db: SQLiteDatabase) => Promise<void>;

const MIGRATIONS: Migration[] = [
    [async (db) => await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE its (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL);
`)],
    [async (db) => await db.execAsync(`
PRAGMA foreign_keys = true;
CREATE TABLE taps (id INTEGER PRIMARY KEY NOT NULL, its_id INTEGER NOT NULL REFERENCES its, tapped_at TEXT NOT NULL);
CREATE INDEX taps_its_index ON taps(its_id);
`)],
];

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    let {user_version: currentDbVersion} = await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
    ) ?? {user_version: 0};

    MIGRATIONS.slice(currentDbVersion).forEach((migration, i) => {
        // This corrects for the index change due to the slice.
        const actualMigrationIndex = i+currentDbVersion;
        console.trace(`Running migration ${actualMigrationIndex}`)
        migration.forEach(async (sqlQuery, j) => {
            console.trace(`Running query ${j} of migration ${actualMigrationIndex}`)
            await sqlQuery(db);
            console.trace(`Finished query ${j} of migration ${actualMigrationIndex}`)
        });
        console.trace(`Finished migration ${actualMigrationIndex}`)
    })

    await db.execAsync(`PRAGMA user_version = ${MIGRATIONS.length}`);
}

