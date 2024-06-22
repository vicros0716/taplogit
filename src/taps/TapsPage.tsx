import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Switch, Text } from 'react-native-paper';
import { It } from '@/its/It';
import { Tap } from '@/taps/Tap';
import { TapsFlatList } from '@/taps/TapsFlatList';
import TapsGraph from '@/taps/TapsGraph';
import TapsList from '@/taps/TapsList';
import useTapsRepository from '@/taps/useTapsRepository';

export default function TapsPage({ mode, it }: { mode: 'chart' | 'list'; it: It }) {
    const [taps, setTaps] = useState<Tap[]>([]);

    const tapsRepository = useTapsRepository();
    const [refreshing, setRefreshing] = useState(false);
    const refreshTaps = useCallback(async () => {
        const taps = await tapsRepository.getTaps(it);
        setTaps(taps);
    }, [it]);

    useEffect(() => {
        async function setup() {
            setRefreshing(true);
            await refreshTaps();
            setRefreshing(false);
        }

        setup();
    }, []);

    const [coalesce, setCoalesce] = useState(false);

    return (
        <View>
            {refreshing && <ActivityIndicator animating />}
            {mode === 'chart' ? (
                <TapsGraph it={it} taps={taps} />
            ) : mode === 'list' ? (
                <>
                    <Text>Should Coalesce? </Text>
                    <Switch value={coalesce} onValueChange={setCoalesce} />
                    {coalesce ? (
                        <TapsList it={it} taps={taps} refreshTaps={refreshTaps} />
                    ) : (
                        <TapsFlatList it={it} taps={taps} />
                    )}
                </>
            ) : null}
        </View>
    );
}
