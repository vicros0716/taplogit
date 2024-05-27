import {Stack} from 'expo-router';
import {PaperProvider} from "react-native-paper";
import {SQLiteProvider} from "expo-sqlite";
import {migrateDbIfNeeded} from "@/db/migrations";
import TapsContextProvider from "@/taps/TapsContextProvider";

export default function RootLayout() {
    return (
        <SQLiteProvider databaseName="taplogit.db" onInit={migrateDbIfNeeded}>
            <PaperProvider>
                <TapsContextProvider>
                    <Stack>
                        <Stack.Screen name="(home)" options={{headerShown: false}}/>
                        <Stack.Screen name="+not-found"/>
                    </Stack>
                </TapsContextProvider>
            </PaperProvider>
        </SQLiteProvider>
    );
}
