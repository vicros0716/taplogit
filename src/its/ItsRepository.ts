import {SQLiteDatabase} from 'expo-sqlite';
import {It} from "@/its/It";
import dayjs from "dayjs";

type DbIt = {
    id: number,
    created_at: string,
    deleted_at: string | null,
    name: string
}

export class ItsRepository {
    private db: SQLiteDatabase;

    constructor(db: SQLiteDatabase) {
        this.db = db;
    }

    async debug(): Promise<void> {
        const tables = await this.db.getAllAsync('SELECT * FROM sqlite_schema');
        console.log(tables);
    }

    async getIts(includeDeleted: boolean = false): Promise<It[]> {
        console.debug('Getting all its');
        const result = await this.db.getAllAsync<DbIt>('SELECT * FROM its' + (includeDeleted ? ';' : ' WHERE deleted_at IS NULL;'));
        console.debug('Got all its')
        return result.map(({id, name, deleted_at}) => ({
            id,
            name,
            isDeleted: deleted_at !== null
        }));
    }

    async createIt(name: string): Promise<It> {
        console.debug(`Creating new it; name: ${name}`)
        const result = await this.db.runAsync('INSERT INTO its (name) VALUES (?)', name);
        console.debug(`Created new it; name: ${name}, id: ${result.lastInsertRowId}`)
        return {
            id: result.lastInsertRowId,
            name,
            isDeleted: false,
        };
    }

    async deleteIt(id: number) {
        console.debug(`Deleting it; id: ${id}`)
        const deletedAt = dayjs.utc().toISOString()
        const result = await this.db.runAsync('UPDATE its SET deleted_at = ? WHERE id = ?', deletedAt, id);
        console.debug(`Deleted it; id: ${id}, deleted_at: ${deletedAt}`)
        return result;
    }

    async restoreIt(id: number) {
        console.debug(`Restoring it; id: ${id}`)
        const result = await this.db.runAsync('UPDATE its SET deleted_at = NULL WHERE id = ?', id);
        console.debug(`Restored it; id: ${id}`)
        return result;
    }
}
