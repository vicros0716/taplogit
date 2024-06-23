import { FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { useTaps } from '@/taps/TapsContext';
import { aggregateAsSwitch } from '@/taps/TapsListHelpers';

export function TapsIntervals() {
    const taps = useTaps();
    const tapPairs = aggregateAsSwitch(taps);
    return (
        <FlatList
            data={tapPairs}
            renderItem={({ item: [startTap, endTap] }) => {
                const durationMinute = endTap.tappedAt.diff(startTap.tappedAt, 'minute');
                return (
                    <Text>
                        {startTap.tappedAt.format('MMM D, YYYY @ hh:mm A')} -{' '}
                        {endTap.id < 0 ? 'Now' : endTap.tappedAt.format('MMM D, YYYY @ hh:mm A')}: {durationMinute}{' '}
                        minutes
                    </Text>
                );
            }}
        />
    );
}
