import { SQLiteDatabase } from 'expo-sqlite';

type DbItWidget = {
    widget_id: number;
    it_id: number;
};

export class WidgetsRepository {
    private db: SQLiteDatabase;

    constructor(db: SQLiteDatabase) {
        this.db = db;
    }

    async getWidgetIdsByItId(itId: number) {
        console.debug(`Getting widget ids associated with it ${itId}`);
        const result = await this.db.getAllAsync<DbItWidget>('SELECT * FROM it_widgets WHERE it_id = ?', itId);
        console.debug(`Got widget ids associated with it ${itId}`);
        return result.map(({ widget_id }) => widget_id);
    }

    async associateWidget(itId: number, widgetId: number) {
        console.debug(`Associating widget ${widgetId} with it ${itId}`);
        const result = await this.db.runAsync(
            'INSERT OR IGNORE INTO it_widgets (widget_id, it_id) VALUES (?, ?)',
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
