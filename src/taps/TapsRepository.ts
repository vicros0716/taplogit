import dayjs from 'dayjs';
import { SQLiteDatabase } from 'expo-sqlite';
import { It } from '@/its/It';
import { Tap } from '@/taps/Tap';

export class TapsRepository {
    private db: SQLiteDatabase;

    constructor(db: SQLiteDatabase) {
        this.db = db;
    }

    async getTaps(it: It): Promise<Tap[]> {
        console.debug(`Getting all taps for ${it.name}`);
        const result = await this.db.getAllAsync<{
            id: number;
            its_id: number;
            tapped_at: string;
        }>('SELECT * FROM taps WHERE its_id = ?', it.id);
        console.debug(`Got all taps for ${it.name}`);
        return result.map(({ id, tapped_at }) => ({
            id,
            it,
            tappedAt: dayjs(tapped_at),
        }));
    }

    async createTap(it: It): Promise<Tap> {
        const tappedAt = dayjs.utc();
        const tappedAtISOString = tappedAt.toISOString();
        console.debug(`Creating new tap; it: ${it.name}, tappedAt: ${tappedAtISOString}`);
        const result = await this.db.runAsync(
            'INSERT INTO taps (its_id, tapped_at) VALUES (?, ?)',
            it.id,
            tappedAtISOString,
        );
        console.debug(`Created new tap; it: ${it.name}, tappedAt: ${tappedAtISOString}, id: ${result.lastInsertRowId}`);
        return {
            id: result.lastInsertRowId,
            it,
            tappedAt,
        };
    }
}
