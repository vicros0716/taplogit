import {Stack} from 'expo-router';
import {PaperProvider} from "react-native-paper";
import {SQLiteProvider} from "expo-sqlite";
import {migrateDbIfNeeded} from "@/app/db/migrations";

export default function RootLayout() {
    return (
        <SQLiteProvider databaseName="taplogit.db" onInit={migrateDbIfNeeded}>
            <PaperProvider>
                <Stack>
                    <Stack.Screen name="(home)" options={{headerShown: false}}/>
                    <Stack.Screen name="+not-found"/>
                </Stack>
            </PaperProvider>
        </SQLiteProvider>
    );
}
