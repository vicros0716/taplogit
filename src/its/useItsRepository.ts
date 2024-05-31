import { useSQLiteContext } from 'expo-sqlite';
import { ItsRepository } from '@/its/ItsRepository';

export default function useItsRepository() {
    const db = useSQLiteContext();
    return new ItsRepository(db);
}
