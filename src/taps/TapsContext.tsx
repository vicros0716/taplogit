import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { It } from '@/its/It';
import { Tap } from '@/taps/Tap';
import useTapsRepository from '@/taps/useTapsRepository';

const TapsItContext = createContext<It>(null as unknown as It);
export const useTapsIt = () => useContext(TapsItContext);

const TapsContext = createContext<Tap[]>([]);
export const useTaps = () => useContext(TapsContext);

const TapsRefreshContext = createContext<[boolean, () => Promise<void>]>([false, async () => {}]);
export const useTapsRefresh = () => useContext(TapsRefreshContext);

const TapDeleteContext = createContext<(tap: Tap) => Promise<void>>(async () => {});
export const useTapDelete = () => useContext(TapDeleteContext);

export default function TapsContextProvider({ it, children }: PropsWithChildren<{ it: It }>) {
    const tapsRepository = useTapsRepository();
    const [taps, setTaps] = useState<Tap[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const refresh = useCallback(async () => {
        setRefreshing(true);
        setTaps(await tapsRepository.getTaps(it));
        setRefreshing(false);
    }, [it]);

    useEffect(() => {
        refresh();
    }, [it]);

    return (
        <TapsItContext.Provider value={it}>
            <TapsContext.Provider value={taps}>
                <TapsRefreshContext.Provider value={[refreshing, refresh]}>
                    <TapDeleteContext.Provider
                        value={async (tap: Tap) => {
                            setRefreshing(true);
                            await tapsRepository.deleteTap(tap.id);
                            await refresh();
                            setRefreshing(false);
                        }}>
                        {children}
                    </TapDeleteContext.Provider>
                </TapsRefreshContext.Provider>
            </TapsContext.Provider>
        </TapsItContext.Provider>
    );
}
