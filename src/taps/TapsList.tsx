import dayjs, { ManipulateType } from 'dayjs';
import { useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { IconButton, Text } from 'react-native-paper';
import { ItType } from '@/its/It';
import { Tap } from '@/taps/Tap';
import useTapsRepository from '@/taps/useTapsRepository';

export default function TapsList({
    taps,
    refreshTaps,
    type,
    coalesceBy,
}: {
    taps: Tap[];
    refreshTaps: () => Promise<void>;
    type: ItType;
    coalesceBy: ManipulateType;
}) {
    const tapsRepository = useTapsRepository();
    const [refreshing, setRefreshing] = useState(false);

    const coalescedTaps = taps.reduce<{ [key: string]: Tap[] }>((acc, tap) => {
        const tappedAtISOString = tap.tappedAt.startOf(coalesceBy).toISOString();
        return {
            ...acc,
            [tappedAtISOString]: [...(acc[tappedAtISOString] ?? []), tap],
        };
    }, {});
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
                <Swipeable
                    overshootLeft={false}
                    overshootRight={false}
                    renderRightActions={() => (
                        <RectButton style={{ backgroundColor: '#AB3717' }}>
                            <IconButton
                                icon="delete"
                                iconColor="white"
                                onPress={async () => {
                                    setRefreshing(true);
                                    await tapsRepository.deleteTap(item.id);
                                    await refreshTaps();
                                    setRefreshing(false);
                                }}
                            />
                        </RectButton>
                    )}>
                    <TapsListItem tap={item} />
                </Swipeable>
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

function TapsListItem({ tap }: { tap: Tap }) {
    return (
        <View style={styles.itemContainer}>
            <Text variant="bodyMedium">{tap.tappedAt.format('MMM D, YYYY @ hh:mm A')}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 48,
        padding: 4,
        paddingLeft: 36,
    },
    sectionHeader: {
        paddingLeft: 12,
    },
});
