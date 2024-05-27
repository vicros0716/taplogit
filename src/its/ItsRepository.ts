import {SQLiteDatabase} from 'expo-sqlite';
import {It} from "@/its/It";

export class ItsRepository {
    private db: SQLiteDatabase;

    constructor(db: SQLiteDatabase) {
        this.db = db;
    }

    async getIts(): Promise<It[]> {
        console.debug('Getting all its');
        const result = await this.db.getAllAsync<It>('SELECT * from its');
        console.debug('Got all its')
        return result;
    }

    async createIt(name: string): Promise<It> {
        console.debug(`Creating new it; name: ${name}`)
        const result = await this.db.runAsync('INSERT INTO its (name) VALUES (?)', name);
        console.debug(`Created new it; name: ${name}, id: ${result.lastInsertRowId}`)
        return {
            id: result.lastInsertRowId,
            name
        };
    }
}
