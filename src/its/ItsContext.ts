import { createContext } from 'react';
import { It } from '@/its/It';
import { ItsRepository } from '@/its/ItsRepository';

export const ItsContext = createContext<{
    itsRepository: ItsRepository;
    its: It[];
    refreshIts: () => Promise<void>;
    showDeleted: boolean;
    setShowDeleted: (showDeleted: boolean) => void;
}>({
    itsRepository: null as unknown as ItsRepository, // This is just to get the types working, it will be set by ItsContextProvider
    its: [],
    refreshIts: async () => {},
    showDeleted: false,
    setShowDeleted: () => {},
});
