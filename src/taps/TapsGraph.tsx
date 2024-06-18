import dayjs, { OpUnitType } from 'dayjs';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import { Tap } from '@/taps/Tap';

export default function TapsGraph({ taps, coalesceBy }: { taps: Tap[]; coalesceBy: OpUnitType }) {
    const theme = useTheme();
    const coalescedTaps = taps.reduce(
        (acc, tap) => {
            const tappedAtISOString = tap.tappedAt.startOf(coalesceBy).toISOString();
            return {
                ...acc,
                [tappedAtISOString]: (acc[tappedAtISOString] ?? 0) + 1,
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
            <VictoryChart
                scale={{ x: 'time' }}
                domainPadding={{ x: 24 }}
                theme={{
                    ...VictoryTheme.material,
                    axis: {
                        ...VictoryTheme.material.axis,
                        style: {
                            ...VictoryTheme.material.axis?.style,
                            axis: {
                                ...VictoryTheme.material.axis?.style?.axis,
                                stroke: theme.colors.outline,
                                strokeWidth: 1,
                            },
                            axisLabel: {
                                ...VictoryTheme.material.axis?.style?.axisLabel,
                                stroke: theme.colors.outline,
                                color: theme.colors.outline,
                            },
                        },
                    },
                }}>
                <VictoryBar
                    data={data}
                    x="tappedAt"
                    y="count"
                    style={{
                        data: {
                            fill: theme.colors.secondaryContainer,
                        },
                    }}
                />
            </VictoryChart>
        </View>
    );
}
