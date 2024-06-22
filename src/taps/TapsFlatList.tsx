import { FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { ItType } from '@/its/It';
import { Tap } from '@/taps/Tap';
import { aggregateAsSwitch } from '@/taps/TapsListHelpers';

export function TapsFlatList({ taps, type }: { taps: Tap[]; type: ItType }) {
    switch (type) {
        case 'tap':
            return (
                <FlatList
                    data={taps}
                    renderItem={({ item }) => <Text>{item.tappedAt.format('MMM D, YYYY @ hh:mm A')}</Text>}
                />
            );
        case 'switch':
            const tapPairs = aggregateAsSwitch(taps);
            console.log(tapPairs);
            return (
                <FlatList
                    data={tapPairs}
                    renderItem={({ item: [startTap, endTap] }) => {
                        const durationMinute = endTap.tappedAt.diff(startTap.tappedAt, 'minute');
                        return (
                            <Text>
                                {startTap.tappedAt.format('MMM D, YYYY @ hh:mm A')} -{' '}
                                {endTap.tappedAt.format('MMM D, YYYY @ hh:mm A')}: {durationMinute} minutes
                            </Text>
                        );
                    }}
                />
            );
    }
}
