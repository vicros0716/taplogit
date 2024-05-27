import {Stack} from 'expo-router';
import {PaperProvider} from "react-native-paper";
import {SQLiteProvider} from "expo-sqlite";
import {migrateDbIfNeeded} from "@/db/migrations";
import ItsContextProvider from "@/its/ItsContextProvider";
import dayjs from "dayjs";
import UTC from 'dayjs/plugin/utc';

dayjs.extend(UTC)

export default function RootLayout() {
    return (
        <SQLiteProvider databaseName="taplogit.db" onInit={migrateDbIfNeeded}>
            <PaperProvider>
                <ItsContextProvider>
                    <Stack>
                        <Stack.Screen name="(home)" options={{headerShown: false}}/>
                        <Stack.Screen name="+not-found"/>
                    </Stack>
                </ItsContextProvider>
            </PaperProvider>
        </SQLiteProvider>
    );
}
