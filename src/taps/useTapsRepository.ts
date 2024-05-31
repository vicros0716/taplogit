import { useSQLiteContext } from 'expo-sqlite';
import { TapsRepository } from '@/taps/TapsRepository';

export default function useTapsRepository() {
    const db = useSQLiteContext();
    return new TapsRepository(db);
}
