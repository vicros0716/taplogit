import { Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { useDialogVisible } from '@/its/DialogContext';
import { ViewType } from '@/its/It';
import { useIts, useRefreshIts } from '@/its/ItsContext';
import useItsRepository from '@/its/useItsRepository';
import TapsContextProvider from '@/taps/TapsContext';
import TapsPage from '@/taps/TapsPage';
import { assertedNonNull } from '@/util/assert';

export default function ItDetailsScreen() {
    const { id } = useLocalSearchParams();
    const itsRepository = useItsRepository();
    const [, refreshIts] = useRefreshIts();
    const its = useIts();
    const { show } = useDialogVisible();
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
        <TapsContextProvider it={it}>
            <SafeAreaView style={styles.container}>
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
                <TapsPage />
            </SafeAreaView>
        </TapsContextProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
