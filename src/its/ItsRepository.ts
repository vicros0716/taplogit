import dayjs, { OpUnitType } from 'dayjs';
import { SQLiteDatabase } from 'expo-sqlite';
import { It } from '@/its/It';

type DbIt = {
    id: number;
    created_at: string;
    deleted_at: string | null;
    name: string;
    coalesce_by: string;
};

export function isValidCoalesceBy(coalesceBy: string): coalesceBy is OpUnitType {
    return ['week', 'day', 'hour'].includes(coalesceBy);
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
        const result = await this.db.getAllAsync<DbIt>(
            'SELECT * FROM its' + (includeDeleted ? ';' : ' WHERE deleted_at IS NULL;'),
        );
        console.debug('Got all its');
        return result.map(({ id, name, deleted_at, coalesce_by }) => ({
            id,
            name,
            isDeleted: deleted_at !== null,
            coalesceBy: isValidCoalesceBy(coalesce_by) ? coalesce_by : 'day',
        }));
    }

    async createIt(name: string) {
        console.debug(`Creating new it; name: ${name}`);
        const result = await this.db.runAsync('INSERT INTO its (name) VALUES (?)', name);
        console.debug(`Created new it; name: ${name}, id: ${result.lastInsertRowId}`);
        return result;
    }

    async deleteIt(id: number) {
        console.debug(`Deleting it; id: ${id}`);
        const deletedAt = dayjs.utc().toISOString();
        const result = await this.db.runAsync('UPDATE its SET deleted_at = ? WHERE id = ?', deletedAt, id);
        console.debug(`Deleted it; id: ${id}, deleted_at: ${deletedAt}`);
        return result;
    }

    async restoreIt(id: number) {
        console.debug(`Restoring it; id: ${id}`);
        const result = await this.db.runAsync('UPDATE its SET deleted_at = NULL WHERE id = ?', id);
        console.debug(`Restored it; id: ${id}`);
        return result;
    }

    async setCoalesceBy(id: number, coalesceBy: OpUnitType) {
        console.debug(`Setting coalesce by ${coalesceBy} for it; id: ${id}`);
        const result = await this.db.runAsync('UPDATE its SET coalesce_by = ? WHERE id = ?', coalesceBy, id);
        console.debug(`Set coalesce by ${coalesceBy} for it; id: ${id}`);
        return result;
    }
}
