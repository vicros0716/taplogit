import { Stack, useLocalSearchParams } from 'expo-router';
import { useContext } from 'react';
import { View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { ViewType } from '@/its/It';
import { ItDialogContext } from '@/its/ItDialogContext';
import { ItsContext } from '@/its/ItsContext';
import TapsPage from '@/taps/TapsPage';
import { assertedNonNull } from '@/util/assert';

export default function ItDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { itsRepository, its, refreshIts } = useContext(ItsContext);
    const { show } = useContext(ItDialogContext);
    const it = assertedNonNull(its.find((it) => it.id.toString() === id));
    const theme = useTheme();
    const icons: { [view in ViewType]: string } = {
        list: 'view-list',
        chart: 'chart-bar',
        intervals: 'chart-timeline',
    };
    let nextView: ViewType;
    if (it.view === 'list') {
        nextView = 'chart';
    } else if (it.view === 'chart') {
        if (it.type === 'tap') {
            nextView = 'list';
        } else if (it.type === 'switch') {
            nextView = 'intervals';
        }
    } else if (it.view === 'intervals') {
        nextView = 'list';
    }

    return (
        <View>
            <Stack.Screen
                options={{
                    title: it.name,
                    headerRight: () => (
                        <>
                            <IconButton
                                iconColor={theme.colors.onPrimary}
                                icon="pencil-outline"
                                onPress={() => show(it)}
                            />
                            <IconButton
                                iconColor={theme.colors.onPrimary}
                                icon={icons[nextView]}
                                onPress={async () => {
                                    await itsRepository.setView(it.id, nextView);
                                    await refreshIts();
                                }}
                            />
                        </>
                    ),
                }}
            />
            <TapsPage it={it} />
        </View>
    );
}
