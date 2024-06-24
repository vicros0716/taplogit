import { SQLiteProvider } from 'expo-sqlite';
import { FlatList, Pressable, SafeAreaView, StyleSheet, useColorScheme, View } from 'react-native';
import { WidgetConfigurationScreenProps } from 'react-native-android-widget';
import { Appbar, Icon, PaperProvider, Text, useTheme } from 'react-native-paper';
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
    const theme = useTheme();
    const widgetsRepository = useWidgetsRepository();

    return (
        <SafeAreaView>
            <Appbar.Header mode="center-aligned" style={{ backgroundColor: theme.colors.primary }}>
                <Appbar.Action icon="close" color={theme.colors.onPrimary} onPress={() => setResult('cancel')} />
                <Appbar.Content
                    title="Configure your Tap Widget"
                    titleStyle={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}
                />
            </Appbar.Header>
            <FlatList
                data={its}
                renderItem={({ item: it }) => (
                    <Pressable
                        onPress={async () => {
                            await widgetsRepository.associateWidget(it.id, widgetInfo.widgetId);
                            renderWidget(<TapWidgIt it={it} />);
                            setResult('ok');
                        }}>
                        <View style={styles.button}>
                            <Text variant="titleLarge">{it.name}</Text>
                            <Icon
                                source={
                                    it.type === 'tap'
                                        ? 'gesture-tap'
                                        : it.numberOfTaps % 2 === 0
                                          ? 'toggle-switch-off-outline'
                                          : 'toggle-switch-outline'
                                }
                                size={30}
                            />
                        </View>
                    </Pressable>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 14,
        height: 44,
        margin: 4,
        padding: 4,
        paddingLeft: 12,
        paddingRight: 12,
    },
});
