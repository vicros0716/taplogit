import { useContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { TapsContext } from '@/taps/TapsContext';
import TapsGraph from '@/taps/TapsGraph';
import { TapsIntervals } from '@/taps/TapsIntervals';
import TapsList from '@/taps/TapsList';

export default function TapsPage() {
    const { it, refreshTaps } = useContext(TapsContext);
    const [refreshing, setRefreshing] = useState(false);

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
            {it.view === 'chart' ? <TapsGraph /> : it.view === 'list' ? <TapsList /> : <TapsIntervals />}
        </View>
    );
}
