import {Stack} from 'expo-router';
import {PaperProvider} from "react-native-paper";

export default function RootLayout() {
    return (
        <PaperProvider>
            <Stack>
                <Stack.Screen name="(home)" options={{headerShown: false}}/>
                <Stack.Screen name="+not-found"/>
            </Stack>
        </PaperProvider>
    );
}
