import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useContext, useState } from 'react';
import { ItsContext } from '@/its/ItsContext';
import { assertedNonNull } from '@/util/assert';
import { IconButton } from 'react-native-paper';
import TapsPage from '@/taps/TapsPage';

export default function ItDetailsScreen() {
    const [showChart, setShowChart] = useState(true);
    const { id } = useLocalSearchParams();
    const { its } = useContext(ItsContext);
    const it = assertedNonNull(its.find((it) => it.id.toString() === id));

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: it.name,
                    headerRight: () => (
                        <IconButton
                            icon={showChart ? 'view-list' : 'chart-line'}
                            iconColor="white"
                            onPress={() => setShowChart(!showChart)}
                        />
                    ),
                }}
            />
            <TapsPage mode={showChart ? 'chart' : 'list'} it={it} />
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
