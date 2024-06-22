import { createContext } from 'react';
import { It } from '@/its/It';
import { Tap } from '@/taps/Tap';
import { TapsRepository } from '@/taps/TapsRepository';

export const TapsContext = createContext<{
    tapsRepository: TapsRepository;
    it: It;
    taps: Tap[];
    refreshTaps: () => Promise<void>;
}>({
    tapsRepository: null as unknown as TapsRepository, // This is just to get the types working, it will be set by TapsContextProvider
    it: null as unknown as It,
    taps: [],
    refreshTaps: async () => {},
});
