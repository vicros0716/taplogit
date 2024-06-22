import { PropsWithChildren, useState } from 'react';
import { It } from '@/its/It';
import { Tap } from '@/taps/Tap';
import { TapsContext } from '@/taps/TapsContext';
import useTapsRepository from '@/taps/useTapsRepository';

export default function TapsContextProvider({ it, children }: PropsWithChildren<{ it: It }>) {
    const tapsRepository = useTapsRepository();
    const [taps, setTaps] = useState<Tap[]>([]);

    return (
        <TapsContext.Provider
            value={{
                tapsRepository,
                it,
                taps,
                refreshTaps: async () => {
                    setTaps(await tapsRepository.getTaps(it));
                },
            }}>
            {children}
        </TapsContext.Provider>
    );
}
