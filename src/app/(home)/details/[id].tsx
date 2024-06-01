import { Stack, useLocalSearchParams } from 'expo-router';
import { useContext, useState } from 'react';
import { View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { ItsContext } from '@/its/ItsContext';
import TapsPage from '@/taps/TapsPage';
import { assertedNonNull } from '@/util/assert';

export default function ItDetailsScreen() {
    const [showChart, setShowChart] = useState(true);
    const { id } = useLocalSearchParams();
    const { its } = useContext(ItsContext);
    const it = assertedNonNull(its.find((it) => it.id.toString() === id));
    const theme = useTheme();

    return (
        <View>
            <Stack.Screen
                options={{
                    title: it.name,
                    headerRight: () => (
                        <IconButton
                            iconColor={theme.colors.onPrimary}
                            icon={showChart ? 'view-list' : 'chart-line'}
                            onPress={() => setShowChart(!showChart)}
                        />
                    ),
                }}
            />
            <TapsPage mode={showChart ? 'chart' : 'list'} it={it} />
        </View>
    );
}
