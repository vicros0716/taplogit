import { FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { It } from '@/its/It';
import { Tap } from '@/taps/Tap';
import { aggregateAsSwitch } from '@/taps/TapsListHelpers';

export function TapsFlatList({ it, taps }: { it: It; taps: Tap[] }) {
    switch (it.type) {
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
                                {endTap.id < 0 ? 'Now' : endTap.tappedAt.format('MMM D, YYYY @ hh:mm A')}:{' '}
                                {durationMinute} minutes
                            </Text>
                        );
                    }}
                />
            );
    }
}
