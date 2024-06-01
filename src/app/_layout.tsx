import { Stack } from 'expo-router';
import { registerWidgetConfigurationScreen, registerWidgetTaskHandler } from 'react-native-android-widget';
import { PaperProvider } from 'react-native-paper';
import { SQLiteProvider } from 'expo-sqlite';
import ItsContextProvider from '@/its/ItsContextProvider';
import dayjs from 'dayjs';
import UTC from 'dayjs/plugin/utc';
import { initializeDb } from '@/db/initializeDb';
import { widgetTaskHandler } from '@/widgetTaskHandler';
import { WidgetConfigurationScreen } from '@/WidgetConfigurationScreen';
import { LogBox } from 'react-native';

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
                <ItsContextProvider>
                    <Stack>
                        <Stack.Screen name="(home)" options={{ headerShown: false }} />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                </ItsContextProvider>
            </PaperProvider>
        </SQLiteProvider>
    );
}
