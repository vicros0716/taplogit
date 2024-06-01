import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Tap } from '@/taps/Tap';

export default function TapsList({ taps, refreshTaps }: { taps: Tap[]; refreshTaps: () => Promise<void> }) {
    const [refreshing, setRefreshing] = useState(false);

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
