import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function HomeLayout() {
    const theme = useTheme();
    return (
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
    );
}
