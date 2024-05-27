import {SQLiteDatabase} from 'expo-sqlite';
import {Tap} from "@/taps/Tap";

export class TapsRepository {
    private db: SQLiteDatabase;

    constructor(db: SQLiteDatabase) {
        this.db = db;
    }

    async getTaps(): Promise<Tap[]> {
        console.debug('Getting all taps');
        const result = await this.db.getAllAsync<Tap>('SELECT * from taps');
        console.debug('Got all taps')
        return result;
    }

    async createTap(name: string): Promise<Tap> {
        console.debug(`Creating new tap; name: ${name}`)
        const result = await this.db.runAsync('INSERT INTO taps (name) VALUES (?)', name);
        console.debug(`Created new tap; name: ${name}, id: ${result.lastInsertRowId}`)
        return {
            id: result.lastInsertRowId,
            name
        };
    }
}
