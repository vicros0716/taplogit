import dayjs from 'dayjs';
import { SQLiteDatabase } from 'expo-sqlite';
import { It } from '@/its/It';
import { Tap } from '@/taps/Tap';

type DbTap = {
    tap_id: number;
    it_id: number;
    tapped_at: number;
};

export class TapsRepository {
    private db: SQLiteDatabase;

    constructor(db: SQLiteDatabase) {
        this.db = db;
    }

    async getTaps(it: It): Promise<Tap[]> {
        console.debug(`Getting all taps for ${it.name}`);
        const result = await this.db.getAllAsync<DbTap>(
            'SELECT * FROM taps WHERE it_id = ? ORDER BY tapped_at DESC',
            it.id,
        );
        console.debug(`Got all taps for ${it.name}`);
        return result.map(({ tap_id, tapped_at }) => ({
            id: tap_id,
            it,
            tappedAt: dayjs.unix(tapped_at),
        }));
    }

    async getLatestTap(it: It): Promise<Tap | null> {
        console.debug(`Getting latest tap for ${it.name}`);
        const result = await this.db.getFirstAsync<DbTap>(
            'SELECT * FROM taps WHERE it_id = ? ORDER BY tapped_at DESC LIMIT 1',
            it.id,
        );
        console.debug(`Got latest tap for ${it.name}`);
        return result === null
            ? null
            : {
                  id: result.tap_id,
                  it,
                  tappedAt: dayjs.unix(result.tapped_at),
              };
    }

    async createTap(it: It) {
        console.debug(`Creating new tap for ${it.name}`);
        const result = await this.db.runAsync('INSERT INTO taps (it_id) VALUES (?)', it.id);
        console.debug(`Created new tap for ${it.name}, id: ${result.lastInsertRowId}`);
        return result;
    }

    async deleteTap(id: number) {
        console.debug(`Deleting it ${id}`);
        const result = await this.db.runAsync('DELETE FROM taps WHERE tap_id = ?', id);
        console.debug(`Deleted it ${id}`);
        return result;
    }
}
