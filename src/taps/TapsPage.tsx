import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { It } from '@/its/It';
import { Tap } from '@/taps/Tap';
import TapsGraph from '@/taps/TapsGraph';
import TapsList from '@/taps/TapsList';
import useTapsRepository from '@/taps/useTapsRepository';

export default function TapsPage({ mode, it }: { mode: 'chart' | 'list'; it: It }) {
    const [taps, setTaps] = useState<Tap[]>([]);

    const tapsRepository = useTapsRepository();
    const [refreshing, setRefreshing] = useState(false);
    const refreshTaps = useCallback(async () => {
        setTaps(await tapsRepository.getTaps(it));
    }, [it]);

    useEffect(() => {
        async function setup() {
            setRefreshing(true);
            await refreshTaps();
            setRefreshing(false);
        }

        setup();
    }, []);

    if (refreshing) {
        return <ActivityIndicator animating />;
    }

    switch (mode) {
        case 'chart':
            return <TapsGraph taps={taps} />;
        case 'list':
            return <TapsList taps={taps} refreshTaps={refreshTaps} />;
    }
}
