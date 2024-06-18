import { useSQLiteContext } from 'expo-sqlite';
import { WidgetsRepository } from '@/widgets/WidgetsRepository';

export default function useWidgetsRepository() {
    const db = useSQLiteContext();
    return new WidgetsRepository(db);
}
