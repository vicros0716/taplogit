import dayjs from 'dayjs';
import UTC from 'dayjs/plugin/utc';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { LogBox } from 'react-native';
import { registerWidgetConfigurationScreen, registerWidgetTaskHandler } from 'react-native-android-widget';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { WidgetConfigurationScreen } from '@/WidgetConfigurationScreen';
import { initializeDb } from '@/db/initializeDb';
import ItsContextProvider from '@/its/ItsContextProvider';
import { widgetTaskHandler } from '@/widgetTaskHandler';

// See https://day.js.org/docs/en/plugin/utc
dayjs.extend(UTC);

// See https://commerce.nearform.com/open-source/victory/docs/react-native#ignoring-require-cycles
LogBox.ignoreLogs(['Require cycle: node_modules/victory']);

// See https://saleksovski.github.io/react-native-android-widget/docs/tutorial/register-task-handler
registerWidgetTaskHandler(widgetTaskHandler);
// See https://saleksovski.github.io/react-native-android-widget/docs/tutorial/make-widget-configurable
registerWidgetConfigurationScreen(WidgetConfigurationScreen);

export default function RootLayout() {
    return (
        <SQLiteProvider databaseName="taplogit.db" onInit={initializeDb}>
            <PaperProvider>
                <GestureHandlerRootView>
                    <ItsContextProvider>
                        <Stack>
                            <Stack.Screen name="(home)" options={{ headerShown: false }} />
                            <Stack.Screen name="+not-found" />
                        </Stack>
                    </ItsContextProvider>
                </GestureHandlerRootView>
            </PaperProvider>
        </SQLiteProvider>
    );
}
