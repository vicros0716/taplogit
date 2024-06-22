import dayjs from 'dayjs';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import { It } from '@/its/It';
import { Tap } from '@/taps/Tap';
import { aggregateAsSwitch, aggregateAsTaps } from '@/taps/TapsGraphHelpers';

export default function TapsGraph({ it, taps }: { it: It; taps: Tap[] }) {
    const theme = useTheme();
    const aggregate = it.type === 'tap' ? aggregateAsTaps : aggregateAsSwitch;
    const aggregatedTaps = aggregate(taps, it.coalesceBy);
    const data = Object.entries(aggregatedTaps).map(([timestampString, count]) => ({
        x: dayjs.unix(parseInt(timestampString)).toDate(),
        y: count,
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
