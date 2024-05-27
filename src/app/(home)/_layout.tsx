import {Stack} from 'expo-router';

export default function HomeLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#f4511e',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}>
            <Stack.Screen name="index" options={{title: 'Tap Log It'}}/>
            <Stack.Screen name="details/[id]" options={{title: 'What in the?'}}/>
        </Stack>
    );
}
