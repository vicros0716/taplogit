import { ManipulateType } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import { asValidCoalesceBy, DEFAULT_COALESCE_BY, It } from '@/its/It';
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
    }, [it]);

    useEffect(() => {
        async function setup() {
            setRefreshing(true);
            await refreshTaps();
            setRefreshing(false);
        }

        setup();
    }, []);

    const [coalesceBy, setCoalesceBy] = useState(DEFAULT_COALESCE_BY);
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
                    const coalesceBy: ManipulateType = asValidCoalesceBy(value);
                    await itsRepository.setCoalesceBy(it.id, coalesceBy);
                    setCoalesceBy(coalesceBy);
                }}
                style={styles.unitsOfTime}
            />
            {refreshing && <ActivityIndicator animating />}
            {mode === 'chart' ? (
                <TapsGraph taps={taps} type={it.type} coalesceBy={coalesceBy} />
            ) : mode === 'list' ? (
                <TapsList taps={taps} type={it.type} refreshTaps={refreshTaps} coalesceBy={coalesceBy} />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    unitsOfTime: {
        margin: 12,
    },
});
