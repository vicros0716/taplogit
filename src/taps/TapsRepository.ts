import dayjs from 'dayjs';
import { SQLiteDatabase } from 'expo-sqlite';
import { It } from '@/its/It';
import { Tap } from '@/taps/Tap';

type DbTap = {
    id: number;
    its_id: number;
    tapped_at: number;
};

export class TapsRepository {
    private db: SQLiteDatabase;

    constructor(db: SQLiteDatabase) {
        this.db = db;
    }

    async getTaps(it: It): Promise<Tap[]> {
        console.debug(`Getting all taps for ${it.name}`);
        const result = await this.db.getAllAsync<DbTap>('SELECT * FROM taps WHERE its_id = ?', it.id);
        console.debug(`Got all taps for ${it.name}`);
        return result.map(({ id, tapped_at }) => ({
            id,
            it,
            tappedAt: dayjs.unix(tapped_at),
        }));
    }

    async createTap(it: It) {
        console.debug(`Creating new tap; it: ${it.name}`);
        const result = await this.db.runAsync('INSERT INTO taps (its_id) VALUES (?)', it.id);
        console.debug(`Created new tap; it: ${it.name}, id: ${result.lastInsertRowId}`);
        return result;
    }

    async deleteTap(id: number) {
        console.debug(`Deleting it; id: ${id}`);
        const result = await this.db.runAsync('DELETE FROM taps WHERE id = ?', id);
        console.debug(`Deleted it; id: ${id}`);
        return result;
    }
}
