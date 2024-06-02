import { OpUnitType } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { requestWidgetUpdateById } from 'react-native-android-widget';
import { ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import { It } from '@/its/It';
import ItWidget from '@/its/ItWidget';
import { isValidCoalesceBy } from '@/its/ItsRepository';
import useItsRepository from '@/its/useItsRepository';
import { Tap } from '@/taps/Tap';
import TapsGraph from '@/taps/TapsGraph';
import TapsList from '@/taps/TapsList';
import useTapsRepository from '@/taps/useTapsRepository';

export default function TapsPage({ mode, it }: { mode: 'chart' | 'list'; it: It }) {
    const [taps, setTaps] = useState<Tap[]>([]);

    const itsRepository = useItsRepository();
    const tapsRepository = useTapsRepository();
    const [refreshing, setRefreshing] = useState(false);
    const refreshTaps = useCallback(async () => {
        const taps = await tapsRepository.getTaps(it);
        setTaps(taps);
        const latestTap = taps[0];
        const widgetIds = await itsRepository.getWidgetIdsByItId(it.id);
        await Promise.all(
            widgetIds.map((widgetId) =>
                requestWidgetUpdateById({
                    widgetName: 'It',
                    widgetId,
                    renderWidget: () => <ItWidget it={it} latestTap={latestTap} />,
                }),
            ),
        );
    }, [it]);

    useEffect(() => {
        async function setup() {
            setRefreshing(true);
            await refreshTaps();
            setRefreshing(false);
        }

        setup();
    }, []);

    const [coalesceBy, setCoalesceBy] = useState<OpUnitType>('day');
    return (
        <View>
            <SegmentedButtons
                buttons={[
                    { value: 'week', label: 'Week' },
                    { value: 'day', label: 'Day' },
                    { value: 'hour', label: 'Hour' },
                ]}
                value={coalesceBy}
                onValueChange={async (value) => {
                    const coalesceBy: OpUnitType = isValidCoalesceBy(value) ? value : 'day';
                    await itsRepository.setCoalesceBy(it.id, coalesceBy);
                    setCoalesceBy(coalesceBy);
                }}
                style={styles.unitsOfTime}
            />
            {refreshing && <ActivityIndicator animating />}
            {mode === 'chart' ? (
                <TapsGraph taps={taps} coalesceBy={coalesceBy} />
            ) : mode === 'list' ? (
                <TapsList taps={taps} refreshTaps={refreshTaps} coalesceBy={coalesceBy} />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    unitsOfTime: {
        margin: 12,
    },
});
