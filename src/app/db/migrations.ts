import {SQLiteDatabase} from "expo-sqlite";

type Migration = SQLQuery[];
type SQLQuery = (db: SQLiteDatabase) => Promise<void>;

const MIGRATIONS: Migration[] = [
    [async (db) => await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE taps (id INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL);
`)]
];

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    let {user_version: currentDbVersion} = await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
    ) ?? {user_version: 0};

    MIGRATIONS.slice(currentDbVersion).forEach((migration, i) => {
        console.trace(`Running migration ${i}`)
        migration.forEach(async (sqlQuery, j) => {
            console.trace(`Running query ${j} of migration ${i}`)
            await sqlQuery(db);
            console.trace(`Finished query ${j} of migration ${i}`)
        });
        console.trace(`Finished migration ${i}`)
    })

    await db.execAsync(`PRAGMA user_version = ${MIGRATIONS.length}`);
}

