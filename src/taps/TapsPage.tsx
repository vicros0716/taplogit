import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { It } from '@/its/It';
import { Tap } from '@/taps/Tap';
import { TapsFlatList } from '@/taps/TapsFlatList';
import TapsGraph from '@/taps/TapsGraph';
import TapsList from '@/taps/TapsList';
import useTapsRepository from '@/taps/useTapsRepository';

export default function TapsPage({ it }: { it: It }) {
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

    return (
        <View>
            {refreshing && <ActivityIndicator animating />}
            {it.view === 'chart' ? (
                <TapsGraph it={it} taps={taps} />
            ) : it.view === 'list' ? (
                <TapsList it={it} taps={taps} refreshTaps={refreshTaps} />
            ) : (
                <TapsFlatList it={it} taps={taps} />
            )}
        </View>
    );
}
