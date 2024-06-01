import dayjs, { OpUnitType } from 'dayjs';
import { useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { Tap } from '@/taps/Tap';
import useTapsRepository from '@/taps/useTapsRepository';

export default function TapsList({
    taps,
    refreshTaps,
    coalesceBy,
}: {
    taps: Tap[];
    refreshTaps: () => Promise<void>;
    coalesceBy: OpUnitType;
}) {
    const tapsRepository = useTapsRepository();
    const [refreshing, setRefreshing] = useState(false);

    const coalescedTaps = taps.reduce(
        (acc, tap) => {
            const tappedAtISOString = tap.tappedAt.startOf(coalesceBy).toISOString();
            return {
                ...acc,
                [tappedAtISOString]: [...(acc[tappedAtISOString] ?? []), tap],
            };
        },
        {} as { [key: string]: Tap[] },
    );
    const data = Object.entries(coalescedTaps).map(([tappedAtISOString, taps]) => {
        const coalescedTappedAt = dayjs(tappedAtISOString);
        let title = coalescedTappedAt.format('MMM D, YYYY');
        switch (coalesceBy) {
            case 'week':
                title = `Week of ${title}`;
                break;
            case 'hour':
                title = `${title} @ ${coalescedTappedAt.format('h A')}`;
                break;
        }
        return {
            title,
            data: taps,
        };
    });
    return (
        <SectionList
            sections={data}
            renderItem={({ item }) => (
                <TapsListItem
                    tap={item}
                    deleteTap={async () => {
                        setRefreshing(true);
                        await tapsRepository.deleteTap(item.id);
                        await refreshTaps();
                        setRefreshing(false);
                    }}
                />
            )}
            renderSectionHeader={({ section: { title } }) => <TapsListSectionHeader title={title} />}
            refreshing={refreshing}
            onRefresh={async () => {
                setRefreshing(true);
                await refreshTaps();
                setRefreshing(false);
            }}
        />
    );
}

function TapsListSectionHeader({ title }: { title: string }) {
    return (
        <Text style={styles.sectionHeader} variant="titleMedium">
            {title}
        </Text>
    );
}

function TapsListItem({ tap, deleteTap }: { tap: Tap; deleteTap: () => Promise<void> }) {
    return (
        <View style={styles.itemContainer}>
            <Text variant="bodyMedium">{tap.tappedAt.format('MMM D, YYYY @ hh:mm A')}</Text>
            <IconButton icon="delete" onPress={deleteTap} />
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        padding: 4,
        paddingLeft: 36,
    },
    sectionHeader: {
        paddingLeft: 12,
    },
});
