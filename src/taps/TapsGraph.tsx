import { ManipulateType } from 'dayjs';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import { ItType } from '@/its/It';
import { Tap } from '@/taps/Tap';
import { asSwitchData, asTapData } from '@/taps/TapsGraphHelpers';

export default function TapsGraph({
    taps,
    type,
    coalesceBy,
}: {
    taps: Tap[];
    type: ItType;
    coalesceBy: ManipulateType;
}) {
    const theme = useTheme();
    const converter = type === 'tap' ? asTapData : asSwitchData;
    const data = converter(taps, coalesceBy);

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
