import { StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import { useEnum } from '@/hooks/useEnum';
import { useTaps } from '@/taps/TapsContext';
import { aggregateAsSwitch } from '@/taps/TapsListHelpers';

export function TapsIntervals() {
    const [sortDirection, next] = useEnum(['descending', 'ascending'] as const);
    const taps = useTaps();
    const tapPairs = aggregateAsSwitch(taps);
    if (sortDirection === 'ascending') {
        tapPairs.reverse();
    }
    return (
        <DataTable style={{ backgroundColor: 'transparent' }}>
            <DataTable.Header>
                <DataTable.Title textStyle={styles.title} sortDirection={sortDirection} onPress={next}>
                    Start
                </DataTable.Title>
                <DataTable.Title textStyle={styles.title}>End</DataTable.Title>
            </DataTable.Header>
            {tapPairs.map(([startTap, endTap], index) => (
                <DataTable.Row key={index}>
                    <DataTable.Cell textStyle={styles.cell}>
                        {startTap.tappedAt.format('MMM D, YYYY @ hh:mm A')}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={styles.cell}>
                        {endTap.id < 0 ? 'Now' : endTap.tappedAt.format('MMM D, YYYY @ hh:mm A')}
                    </DataTable.Cell>
                </DataTable.Row>
            ))}
        </DataTable>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cell: {
        fontSize: 14,
    },
});
