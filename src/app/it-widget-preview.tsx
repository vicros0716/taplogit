import dayjs from 'dayjs';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WidgetPreview } from 'react-native-android-widget';
import { It } from '@/its/It';
import { Tap } from '@/taps/Tap';
import TapWidgIt from '@/widgets/TapWidgIt';

export default function ItWidgetPreview() {
    return (
        <SafeAreaView style={styles.container}>
            <WidgetPreview
                renderWidget={() => {
                    const it: It = {
                        id: 2,
                        name: 'Preview widget',
                        isDeleted: false,
                        coalesceBy: 'day',
                    };
                    const latestTap: Tap = {
                        id: 3,
                        it,
                        tappedAt: dayjs(),
                    };
                    return <TapWidgIt it={it} latestTap={latestTap} />;
                }}
                width={320}
                height={200}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
