import {SQLiteDatabase} from 'expo-sqlite';

export class TapRepository {
    private db: SQLiteDatabase;

    constructor(db: SQLiteDatabase) {
        this.db = db;
    }

    async createTap(name: string) {
        console.trace(`Creating new tap with name ${name}`)
        const result = await this.db.runAsync('INSERT INTO taps (name) VALUES (?)', name);
        console.trace(`Finished creating new tap`)
        return result;
    }
}
