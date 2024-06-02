import { SQLiteProvider } from 'expo-sqlite';
import { useContext, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { WidgetConfigurationScreenProps } from 'react-native-android-widget';
import { Button, PaperProvider, Text } from 'react-native-paper';
import { initializeDb } from '@/db/initializeDb';
import { It } from '@/its/It';
import ItWidget from '@/its/ItWidget';
import { ItsContext } from '@/its/ItsContext';
import ItsContextProvider from '@/its/ItsContextProvider';
import useItsRepository from '@/its/useItsRepository';
import useTapsRepository from '@/taps/useTapsRepository';

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
                renderItem={({ item }) => (
                    <WidgetConfigurationScreenListItem
                        it={item}
                        widgetId={widgetInfo.widgetId}
                        onPress={async (widget: JSX.Element) => {
                            renderWidget(widget);
                            setResult('ok');
                        }}
                    />
                )}
                style={styles.list}
            />
            <Button onPress={() => setResult('cancel')}>Cancel</Button>
        </View>
    );
}

function WidgetConfigurationScreenListItem({
    it,
    widgetId,
    onPress,
}: {
    it: It;
    widgetId: number;
    onPress: (widget: JSX.Element) => void;
}) {
    const itsRepository = useItsRepository();
    const tapsRepository = useTapsRepository();
    return (
        <Button
            mode="contained"
            onPress={async () => {
                await itsRepository.associateWidget(it.id, widgetId);
                const latestTap = await tapsRepository.getLatestTap(it);
                onPress(<ItWidget it={it} latestTap={latestTap} />);
            }}>
            {it.name}
        </Button>
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
