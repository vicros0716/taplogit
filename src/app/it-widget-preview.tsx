import dayjs from 'dayjs';
import { SafeAreaView, StyleSheet } from 'react-native';
import { WidgetPreview } from 'react-native-android-widget';
import { It } from '@/its/It';
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
                        latestTap: dayjs(),
                    };
                    return <TapWidgIt it={it} />;
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
