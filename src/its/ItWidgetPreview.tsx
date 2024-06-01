import { StyleSheet, View } from 'react-native';
import { WidgetPreview } from 'react-native-android-widget';
import ItWidget from '@/its/ItWidget';

export default function ItWidgetPreview() {
    return (
        <View style={styles.container}>
            <WidgetPreview
                renderWidget={() => (
                    <ItWidget
                        it={{
                            id: 2,
                            name: 'Preview widget',
                            isDeleted: false,
                            coalesceBy: 'day',
                        }}
                    />
                )}
                width={320}
                height={200}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
