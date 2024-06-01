import dayjs, { OpUnitType } from 'dayjs';
import { SQLiteDatabase } from 'expo-sqlite';
import { It } from '@/its/It';

type DbIt = {
    it_id: number;
    created_at: number;
    deleted_at: number | null;
    name: string;
    coalesce_by: string;
};

export function isValidCoalesceBy(coalesceBy: string): coalesceBy is OpUnitType {
    return ['week', 'day', 'hour'].includes(coalesceBy);
}

function convert({ it_id, name, deleted_at, coalesce_by }: DbIt): It {
    return {
        id: it_id,
        name,
        isDeleted: deleted_at !== null,
        coalesceBy: isValidCoalesceBy(coalesce_by) ? coalesce_by : 'day',
    };
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
        return result.map(convert);
    }

    async createIt(name: string) {
        console.debug(`Creating new it ${name}`);
        const result = await this.db.runAsync('INSERT INTO its (name) VALUES (?)', name);
        console.debug(`Created new it ${name}; id: ${result.lastInsertRowId}`);
        return result;
    }

    async deleteIt(id: number) {
        console.debug(`Deleting it ${id}`);
        const deletedAt = dayjs().unix();
        const result = await this.db.runAsync('UPDATE its SET deleted_at = ? WHERE it_id = ?', deletedAt, id);
        console.debug(`Deleted it ${id}, deleted_at: ${deletedAt}`);
        return result;
    }

    async restoreIt(id: number) {
        console.debug(`Restoring it ${id}`);
        const result = await this.db.runAsync('UPDATE its SET deleted_at = NULL WHERE it_id = ?', id);
        console.debug(`Restored it ${id}`);
        return result;
    }

    async setCoalesceBy(id: number, coalesceBy: OpUnitType) {
        console.debug(`Setting coalesce by ${coalesceBy} for it ${id}`);
        const result = await this.db.runAsync('UPDATE its SET coalesce_by = ? WHERE it_id = ?', coalesceBy, id);
        console.debug(`Set coalesce by ${coalesceBy} for it ${id}`);
        return result;
    }

    async getItByWidgetId(widgetId: number) {
        console.debug(`Getting it associated with widget ${widgetId}`);
        const result = await this.db.getFirstAsync<DbIt>(
            'SELECT * FROM its JOIN it_widgets USING (it_id) WHERE widget_id = ?',
            widgetId,
        );
        console.debug(`Got it associated with widget ${widgetId}`);
        return result === null ? null : convert(result);
    }

    async associateWidget(itId: number, widgetId: number) {
        console.debug(`Associating widget ${widgetId} with it ${itId}`);
        const result = await this.db.runAsync(
            'INSERT INTO it_widgets (widget_id, it_id) VALUES (?, ?)',
            widgetId,
            itId,
        );
        console.debug(`Associated widget ${widgetId} with it ${itId}`);
        return result;
    }

    async forgetWidget(widgetId: number) {
        console.debug(`Forgetting widget ${widgetId}`);
        const result = await this.db.runAsync('DELETE FROM it_widgets WHERE widget_id = ?', widgetId);
        console.debug(`Forgot widget ${widgetId}`);
        return result;
    }
}
