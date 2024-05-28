import {SQLiteDatabase} from "expo-sqlite";
import {migrateDbIfNeeded} from "@/db/migrations";

export async function initializeDb(db: SQLiteDatabase) {
    await migrateDbIfNeeded(db);
    // SQLite foreign_keys PRAGMA is set on a per-connection basis, so enable it when we initialize
    // https://stackoverflow.com/questions/64785806/why-is-sqlite-pragma-foreign-keys-not-persistent-across-db-connections
    await db.execAsync('PRAGMA foreign_keys = ON');
}