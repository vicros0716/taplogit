import dayjs from 'dayjs';
import { StyleSheet, View } from 'react-native';
import { VictoryBar, VictoryChart, VictoryLabel, VictoryTheme } from 'victory-native';
import { Tap } from '@/taps/Tap';

export default function TapsGraph({ taps }: { taps: Tap[] }) {
    const tapsCoalescedByDay = taps.reduce(
        (acc, tap) => {
            const tappedAtUnixTimestamp = tap.tappedAt.startOf('hour').toISOString();
            return {
                ...acc,
                [tappedAtUnixTimestamp]: (acc[tappedAtUnixTimestamp] ?? 0) + 1,
            };
        },
        {} as { [key: string]: number },
    );
    const data = Object.entries(tapsCoalescedByDay).map(([tappedAtISOString, count]) => ({
        tappedAt: dayjs(tappedAtISOString).toDate(),
        count,
    }));
    return (
        <View style={styles.container}>
            <VictoryChart scale={{ x: 'time' }} domainPadding={{ x: 24 }} theme={VictoryTheme.material}>
                <VictoryBar
                    data={data}
                    x="tappedAt"
                    y="count"
                    style={{ labels: { fill: 'white' } }}
                    labelComponent={<VictoryLabel dy={30} />}
                />
            </VictoryChart>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff',
    },
});
