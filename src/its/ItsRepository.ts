import dayjs, { ManipulateType } from 'dayjs';
import { SQLiteDatabase } from 'expo-sqlite';
import { asValidCoalesceBy, asValidItType, It, ItType } from '@/its/It';

type DbIt = {
    it_id: number;
    created_at: number;
    deleted_at: number | null;
    name: string;
    type: string;
    coalesce_by: string;
    latest_tapped_at: number | null;
};

function convert({ it_id, name, deleted_at, type, coalesce_by, latest_tapped_at }: DbIt): It {
    return {
        id: it_id,
        name,
        isDeleted: deleted_at !== null,
        type: asValidItType(type),
        coalesceBy: asValidCoalesceBy(coalesce_by),
        latestTap: latest_tapped_at ? dayjs.unix(latest_tapped_at) : null,
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
            'SELECT * FROM its_latest_tap WHERE ? = TRUE OR deleted_at IS NULL',
            includeDeleted,
        );
        console.debug('Got all its');
        return result.map(convert);
    }

    async createIt(name: string, type: ItType) {
        console.debug(`Creating new ${type} it ${name}`);
        const result = await this.db.runAsync('INSERT INTO its (name, type) VALUES (?, ?)', name, type);
        console.debug(`Created new ${type} it ${name}; id: ${result.lastInsertRowId}`);
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

    async setCoalesceBy(id: number, coalesceBy: ManipulateType) {
        console.debug(`Setting coalesce by ${coalesceBy} for it ${id}`);
        const result = await this.db.runAsync('UPDATE its SET coalesce_by = ? WHERE it_id = ?', coalesceBy, id);
        console.debug(`Set coalesce by ${coalesceBy} for it ${id}`);
        return result;
    }

    async getItByWidgetId(widgetId: number) {
        console.debug(`Getting it associated with widget ${widgetId}`);
        const result = await this.db.getFirstAsync<DbIt>(
            'SELECT * FROM its_latest_tap JOIN it_widgets USING (it_id) WHERE widget_id = ?',
            widgetId,
        );
        console.debug(`Got it associated with widget ${widgetId}`);
        return result === null ? null : convert(result);
    }
}
