import dayjs from 'dayjs';
import Duration from 'dayjs/plugin/duration';
import Timezone from 'dayjs/plugin/timezone';
import UTC from 'dayjs/plugin/utc';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { LogBox, useColorScheme } from 'react-native';
import { registerWidgetConfigurationScreen, registerWidgetTaskHandler } from 'react-native-android-widget';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { darkTheme } from '@/constants/darkTheme';
import { lightTheme } from '@/constants/lightTheme';
import { DATABASE_NAME } from '@/db/constants';
import { initializeDb } from '@/db/initializeDb';
import { ItsProvider } from '@/its/ItsContext';
import { WidgetConfigurationScreen } from '@/widgets/WidgetConfigurationScreen';
import { registerWidgetListener } from '@/widgets/WidgetListener';
import { widgetTaskHandler } from '@/widgets/widgetTaskHandler';

// See https://day.js.org/docs/en/plugin/utc
dayjs.extend(UTC);
dayjs.extend(Timezone);
dayjs.extend(Duration);

// See https://commerce.nearform.com/open-source/victory/docs/react-native#ignoring-require-cycles
LogBox.ignoreLogs(['Require cycle: node_modules/victory']);

// See https://saleksovski.github.io/react-native-android-widget/docs/tutorial/register-task-handler
registerWidgetTaskHandler(widgetTaskHandler);
// See https://saleksovski.github.io/react-native-android-widget/docs/tutorial/make-widget-configurable
registerWidgetConfigurationScreen(WidgetConfigurationScreen);

registerWidgetListener();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    return (
        <SQLiteProvider databaseName={DATABASE_NAME} onInit={initializeDb}>
            <PaperProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
                <GestureHandlerRootView>
                    <ItsProvider>
                        <Stack>
                            <Stack.Screen name="(home)" options={{ headerShown: false }} />
                            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
                            <Stack.Screen name="it-widget-preview" options={{ title: 'It Widget Preview' }} />
                        </Stack>
                    </ItsProvider>
                </GestureHandlerRootView>
            </PaperProvider>
        </SQLiteProvider>
    );
}
