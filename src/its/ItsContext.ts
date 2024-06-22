import { ManipulateType } from 'dayjs';
import { createContext } from 'react';
import { It, ItType } from '@/its/It';
import { ItsRepository } from '@/its/ItsRepository';

export const ItsContext = createContext<{
    itsRepository: ItsRepository;
    its: It[];
    refreshIts: () => Promise<void>;
    showDeleted: boolean;
    setShowDeleted: (showDeleted: boolean) => void;
    dialogVisible: boolean;
    dialogIt: It | null;
    onDialogConfirm: (name: string, type: ItType, coalesceBy: ManipulateType) => Promise<unknown>;
    showDialog: (
        it: It | null,
        onConfirm?: (name: string, type: ItType, coalesceBy: ManipulateType) => Promise<unknown>,
    ) => void;
    hideDialog: () => void;
}>({
    itsRepository: null as unknown as ItsRepository, // This is just to get the types working, it will be set by ItsContextProvider
    its: [],
    refreshIts: async () => {},
    showDeleted: false,
    setShowDeleted: () => {},
    dialogVisible: false,
    dialogIt: null,
    onDialogConfirm: async () => {},
    showDialog: () => {},
    hideDialog: () => {},
});
