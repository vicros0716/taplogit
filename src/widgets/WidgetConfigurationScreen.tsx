import { SQLiteProvider } from 'expo-sqlite';
import { useContext, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { WidgetConfigurationScreenProps } from 'react-native-android-widget';
import { Button, PaperProvider, Text } from 'react-native-paper';
import { initializeDb } from '@/db/initializeDb';
import { ItsContext } from '@/its/ItsContext';
import ItsContextProvider from '@/its/ItsContextProvider';
import TapWidgIt from '@/widgets/TapWidgIt';
import useWidgetsRepository from '@/widgets/useWidgetsRepository';

export function WidgetConfigurationScreen(props: WidgetConfigurationScreenProps) {
    return (
        <SQLiteProvider databaseName="taplogit.db" onInit={initializeDb}>
            <PaperProvider>
                <ItsContextProvider>
                    <ProvidedWidgetConfigurationScreen {...props} />
                </ItsContextProvider>
            </PaperProvider>
        </SQLiteProvider>
    );
}

function ProvidedWidgetConfigurationScreen({ widgetInfo, setResult, renderWidget }: WidgetConfigurationScreenProps) {
    const { its, refreshIts } = useContext(ItsContext);
    const widgetsRepository = useWidgetsRepository();

    useEffect(() => {
        refreshIts();
    }, []);

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
