import { FlatList, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { It } from '@/its/It';
import { Tap } from '@/taps/Tap';
import { Text } from 'react-native-paper';
import useTapsRepository from '@/taps/useTapsRepository';

export default function TapsList({ it }: { it: It }) {
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
        <FlatList
            data={taps}
            renderItem={({ item }) => <TapsListItem tap={item} />}
            refreshing={refreshing}
            onRefresh={async () => {
                setRefreshing(true);
                await refreshTaps();
                setRefreshing(false);
            }}
        />
    );
}

function TapsListItem({ tap }: { tap: Tap }) {
    return (
        <View>
            <Text variant="bodyLarge">{tap.tappedAt.format('MMM D, YYYY @ hh:mm A')}</Text>
        </View>
    );
}
