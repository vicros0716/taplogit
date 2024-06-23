import dayjs from 'dayjs';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Tap } from '@/taps/Tap';
import { useTaps } from '@/taps/TapsContext';
import { aggregateAsSwitch } from '@/taps/TapsListHelpers';

export function TapsIntervals() {
    const theme = useTheme();
    const taps = useTaps();
    const tapPairs = aggregateAsSwitch(taps);
    return (
        <FlatList
            data={tapPairs}
            renderItem={({ item: [startTap, endTap] }) => <TapsIntervalsItem startTap={startTap} endTap={endTap} />}
            style={{ backgroundColor: theme.colors.surface }}
        />
    );
}

function TapsIntervalsItem({ startTap, endTap }: { startTap: Tap; endTap: Tap }) {
    const duration = dayjs.duration(endTap.tappedAt.diff(startTap.tappedAt)).humanize();
    let text: string;
    if (startTap.tappedAt.isSame(endTap.tappedAt, 'date')) {
        text = `${startTap.tappedAt.format('MMM D, YYYY')} from ${startTap.tappedAt.format('hh:mm A')} to ${endTap.id < 0 ? 'Now' : endTap.tappedAt.format('hh:mm A')}: ${duration}`;
    } else {
        text = `From ${startTap.tappedAt.format('MMM D, YYYY @ hh:mm A')} to ${endTap.id < 0 ? 'Now' : endTap.tappedAt.format('MMM D, YYYY @ hh:mm A')}: ${duration}`;
    }
    return (
        <View style={styles.itemContainer}>
            <Text variant="bodyMedium">{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        height: 48,
        padding: 12,
    },
});
