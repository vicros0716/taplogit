import { ManipulateType } from 'dayjs';
import { createContext } from 'react';
import { It, ItType } from '@/its/It';

export const ItDialogContext = createContext<{
    visible: boolean;
    it: It | null;
    save: (name: string, type: ItType, coalesceBy: ManipulateType) => Promise<unknown>;
    show: (it?: It | null) => void;
    hide: () => void;
}>({
    visible: false,
    it: null,
    save: async () => {},
    show: () => {},
    hide: () => {},
});
