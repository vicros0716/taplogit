import { SQLiteProvider } from 'expo-sqlite';
import { FlatList, StyleSheet, useColorScheme, View } from 'react-native';
import { WidgetConfigurationScreenProps } from 'react-native-android-widget';
import { Button, PaperProvider, Text } from 'react-native-paper';
import { darkTheme } from '@/constants/darkTheme';
import { lightTheme } from '@/constants/lightTheme';
import { DATABASE_NAME } from '@/db/constants';
import { initializeDb } from '@/db/initializeDb';
import { ItsProvider, useIts } from '@/its/ItsContext';
import TapWidgIt from '@/widgets/TapWidgIt';
import useWidgetsRepository from '@/widgets/useWidgetsRepository';

export function WidgetConfigurationScreen(props: WidgetConfigurationScreenProps) {
    const colorScheme = useColorScheme();
    return (
        <SQLiteProvider databaseName={DATABASE_NAME} onInit={initializeDb}>
            <PaperProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
                <ItsProvider>
                    <ProvidedWidgetConfigurationScreen {...props} />
                </ItsProvider>
            </PaperProvider>
        </SQLiteProvider>
    );
}

function ProvidedWidgetConfigurationScreen({ widgetInfo, setResult, renderWidget }: WidgetConfigurationScreenProps) {
    const its = useIts();
    const widgetsRepository = useWidgetsRepository();

    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.title}>
                Configure your Tap Widget
            </Text>
            <FlatList
                data={its}
                renderItem={({ item: it }) => (
                    <Button
                        mode="contained"
                        onPress={async () => {
                            await widgetsRepository.associateWidget(it.id, widgetInfo.widgetId);
                            renderWidget(<TapWidgIt it={it} />);
                            setResult('ok');
                        }}>
                        {it.name}
                    </Button>
                )}
                style={styles.list}
            />
            <Button onPress={() => setResult('cancel')}>Cancel</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        textAlign: 'center',
    },
    list: {
        margin: 12,
    },
});
