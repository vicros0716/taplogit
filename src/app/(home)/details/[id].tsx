import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useContext } from 'react';
import { ItsContext } from '@/its/ItsContext';
import TapsList from '@/taps/TapsList';
import { assertedNonNull } from '@/util/assert';

export default function ItDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { its } = useContext(ItsContext);
    const it = assertedNonNull(its.find((it) => it.id.toString() === id));

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: it.name }} />
            <TapsList it={it} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
