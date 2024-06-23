import dayjs from 'dayjs';
import { SectionList, StyleSheet, View } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { IconButton, Text } from 'react-native-paper';
import { Tap } from '@/taps/Tap';
import { useTapDelete, useTaps, useTapsIt, useTapsRefresh } from '@/taps/TapsContext';
import { aggregateAsTaps } from '@/taps/TapsListHelpers';

export default function TapsList() {
    const it = useTapsIt();
    const taps = useTaps();
    const [refreshing, refresh] = useTapsRefresh();
    const deleteTap = useTapDelete();
    const coalescedTaps = aggregateAsTaps(taps, it.coalesceBy);
    const data = Object.entries(coalescedTaps).map(([tappedAtISOString, taps]) => {
        const coalescedTappedAt = dayjs(tappedAtISOString);
        let title = coalescedTappedAt.format('MMM D, YYYY');
        switch (it.coalesceBy) {
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
            renderItem={({ item: tap }) => (
                <Swipeable
                    overshootLeft={false}
                    overshootRight={false}
                    renderRightActions={() => (
                        <RectButton style={{ backgroundColor: '#AB3717' }}>
                            <IconButton icon="delete" iconColor="white" onPress={() => deleteTap(tap)} />
                        </RectButton>
                    )}>
                    <TapsListItem tap={tap} />
                </Swipeable>
            )}
            renderSectionHeader={({ section: { title } }) => <TapsListSectionHeader title={title} />}
            refreshing={refreshing}
            onRefresh={refresh}
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
