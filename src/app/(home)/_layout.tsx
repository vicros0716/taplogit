import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { DialogProvider } from '@/its/DialogContext';

export default function HomeLayout() {
    const theme = useTheme();
    return (
        <DialogProvider>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.primary,
                    },
                    headerTintColor: theme.colors.onPrimary,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="details/[id]" />
            </Stack>
        </DialogProvider>
    );
}
