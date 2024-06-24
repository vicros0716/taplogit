import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { WidgetPreview } from 'react-native-android-widget';
import { Button, IconButton, SegmentedButtons, Text } from 'react-native-paper';
import { asValidItType, DEFAULT_COALESCE_BY, DEFAULT_IT_TYPE, DEFAULT_VIEW, ItType } from '@/its/It';
import TapWidgIt from '@/widgets/TapWidgIt';

export default function ItWidgetPreview() {
    const [type, setType] = useState<ItType>(DEFAULT_IT_TYPE);
    const [numberOfTaps, setNumberOfTaps] = useState(0);
    const [date, setDate] = useState(new Date());
    return (
        <SafeAreaView style={styles.container}>
            <SegmentedButtons
                buttons={[
                    { value: 'tap', label: 'Tap', icon: 'gesture-tap' },
                    { value: 'switch', label: 'Switch', icon: 'toggle-switch-outline' },
                ]}
                value={type}
                onValueChange={(value) => setType(asValidItType(value))}
            />
            <Button
                onPress={() => {
                    DateTimePickerAndroid.open({
                        value: date,
                        onChange: (event, date) => {
                            setDate(date as Date);
                            DateTimePickerAndroid.open({
                                value: date as Date,
                                onChange: (event, date) => {
                                    setDate(date as Date);
                                },
                                mode: 'time',
                            });
                        },
                        mode: 'date',
                    });
                }}>
                Set latest tap date and time
            </Button>
            <Text>Number of Taps</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconButton icon="minus" onPress={() => setNumberOfTaps(numberOfTaps - 1)} />
                <Text>{numberOfTaps}</Text>
                <IconButton icon="plus" onPress={() => setNumberOfTaps(numberOfTaps + 1)} />
            </View>
            <WidgetPreview
                renderWidget={() => (
                    <TapWidgIt
                        it={{
                            id: 1,
                            name: `Preview ${type} Widget`,
                            isDeleted: false,
                            type,
                            coalesceBy: DEFAULT_COALESCE_BY,
                            view: DEFAULT_VIEW,
                            latestTap: dayjs(date),
                            numberOfTaps,
                        }}
                    />
                )}
                width={360}
                height={120}
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
