import { FlatList, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { TapsRepository } from '@/taps/TapsRepository';
import { It } from '@/its/It';
import { Tap } from '@/taps/Tap';
import { Text } from 'react-native-paper';

export default function TapsList({ it }: { it: It }) {
    const [taps, setTaps] = useState<Tap[]>([]);

    const db = useSQLiteContext();
    const tapsRepository = new TapsRepository(db);
    const [refreshing, setRefreshing] = useState(false);

    async function setup() {
        setRefreshing(true);
        const result = await tapsRepository.getTaps(it);
        setTaps(result);
        setRefreshing(false);
    }

    useEffect(() => {
        setup();
    }, []);

    return (
        <FlatList
            data={taps}
            renderItem={({ item }) => <TapsListItem tap={item} />}
            refreshing={refreshing}
            onRefresh={async () => {
                setRefreshing(true);
                const result = await tapsRepository.getTaps(it);
                setTaps(result);
                setRefreshing(false);
            }}
        />
    );
}

function TapsListItem({ tap }: { tap: Tap }) {
    return (
        <View>
            <Text>{tap.tappedAt.toISOString()}</Text>
        </View>
    );
}
