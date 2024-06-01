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
                        onPress={() => {
                            renderWidget(<ItWidget it={item} />);
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

function WidgetConfigurationScreenListItem({ it, onPress }: { it: It; onPress: () => void }) {
    return (
        <Button mode="contained" onPress={onPress}>
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
