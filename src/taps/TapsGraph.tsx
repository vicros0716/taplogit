import dayjs, { OpUnitType } from 'dayjs';
import { View } from 'react-native';
import { VictoryBar, VictoryChart, VictoryLabel, VictoryTheme } from 'victory-native';
import { Tap } from '@/taps/Tap';

export default function TapsGraph({ taps, coalesceBy }: { taps: Tap[]; coalesceBy: OpUnitType }) {
    const coalescedTaps = taps.reduce(
        (acc, tap) => {
            const tappedAtUnixTimestamp = tap.tappedAt.startOf(coalesceBy).toISOString();
            return {
                ...acc,
                [tappedAtUnixTimestamp]: (acc[tappedAtUnixTimestamp] ?? 0) + 1,
            };
        },
        {} as { [key: string]: number },
    );
    const data = Object.entries(coalescedTaps).map(([tappedAtISOString, count]) => ({
        tappedAt: dayjs(tappedAtISOString).toDate(),
        count,
    }));
    return (
        <View>
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
