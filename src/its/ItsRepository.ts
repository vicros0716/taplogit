import dayjs, { ManipulateType } from 'dayjs';
import { SQLiteDatabase } from 'expo-sqlite';
import { asValidCoalesceBy, asValidItType, asValidView, It, ItType, ViewType } from '@/its/It';

type DbIt = {
    it_id: number;
    created_at: number;
    deleted_at: number | null;
    name: string;
    type: string;
    coalesce_by: string;
    view: string;
    latest_tapped_at: number | null;
    num_taps: number;
};

function convert({ it_id, name, deleted_at, type, coalesce_by, view, latest_tapped_at, num_taps }: DbIt): It {
    return {
        id: it_id,
        name,
        isDeleted: deleted_at !== null,
        type: asValidItType(type),
        coalesceBy: asValidCoalesceBy(coalesce_by),
        view: asValidView(view),
        latestTap: latest_tapped_at ? dayjs.unix(latest_tapped_at) : null,
        numberOfTaps: num_taps,
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
            'SELECT * FROM its_enriched WHERE ? = TRUE OR deleted_at IS NULL',
            includeDeleted,
        );
        console.debug('Got all its');
        return result.map(convert);
    }

    async createIt(name: string, type: ItType, coalesceBy: ManipulateType) {
        console.debug(`Creating new ${type} it ${name}`);
        const result = await this.db.runAsync(
            'INSERT INTO its (name, type, coalesce_by) VALUES (?, ?, ?)',
            name,
            type,
            coalesceBy,
        );
        console.debug(`Created new ${type} it ${name}; id: ${result.lastInsertRowId}`);
        return result;
    }

    async updateIt(id: number, name: string, type: ItType, coalesceBy: ManipulateType) {
        console.debug(`Updating ${type} it ${name}`);
        const result = await this.db.runAsync(
            'UPDATE its SET name = ?, type = ?, coalesce_by = ? WHERE it_id = ?',
            name,
            type,
            coalesceBy,
            id,
        );
        console.debug(`Updated ${type} it ${name}; id: ${result.lastInsertRowId}`);
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

    async setView(id: number, view: ViewType) {
        console.debug(`Setting view ${view} for it ${id}`);
        const result = await this.db.runAsync('UPDATE its SET view = ? WHERE it_id = ?', view, id);
        console.debug(`Set view ${view} for it ${id}`);
        return result;
    }

    async getItByWidgetId(widgetId: number) {
        console.debug(`Getting it associated with widget ${widgetId}`);
        const result = await this.db.getFirstAsync<DbIt>(
            'SELECT * FROM its_enriched JOIN it_widgets USING (it_id) WHERE widget_id = ?',
            widgetId,
        );
        console.debug(`Got it associated with widget ${widgetId}`);
        return result === null ? null : convert(result);
    }
}
