import { Link } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { requestWidgetUpdateById } from 'react-native-android-widget';
import { Swipeable } from 'react-native-gesture-handler';
import { IconButton, Portal, Snackbar, Text, useTheme } from 'react-native-paper';
import { NativeScrollEvent } from 'react-native/Libraries/Components/ScrollView/ScrollView';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import DeleteItButton from '@/its/DeleteItButton';
import { It } from '@/its/It';
import { ItsContext } from '@/its/ItsContext';
import RestoreItButton from '@/its/RestoreItButton';
import useTapsRepository from '@/taps/useTapsRepository';
import TapWidgIt from '@/widgets/TapWidgIt';
import useWidgetsRepository from '@/widgets/useWidgetsRepository';

export default function ItsList({ onScroll }: { onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void }) {
    const { its, refreshIts, showDeleted } = useContext(ItsContext);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        async function setup() {
            setRefreshing(true);
            await refreshIts();
            setRefreshing(false);
        }

        setup();
    }, [showDeleted]);
    const theme = useTheme();

    return (
        <FlatList
            data={its}
            renderItem={({ item }) => (
                <Swipeable
                    overshootLeft={false}
                    overshootRight={false}
                    renderRightActions={() =>
                        item.isDeleted ? <RestoreItButton it={item} /> : <DeleteItButton it={item} />
                    }>
                    <ItsListItem it={item} />
                </Swipeable>
            )}
            onScroll={onScroll}
            refreshing={refreshing}
            onRefresh={async () => {
                setRefreshing(true);
                await refreshIts();
                setRefreshing(false);
            }}
            style={{ backgroundColor: theme.colors.surface }}
        />
    );
}

function ItsListItem({ it }: { it: It }) {
    const tapsRepository = useTapsRepository();
    const widgetsRepository = useWidgetsRepository();
    const [isSnackbarVisible, setSnackbarVisible] = useState(false);
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <Link href={`/details/${it.id}`} style={{ flexGrow: 1 }}>
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                    {it.name}
                </Text>
            </Link>
            <IconButton
                icon="gesture-tap"
                iconColor={theme.colors.onSurface}
                onPress={async () => {
                    await tapsRepository.createTap(it);
                    const latestTap = await tapsRepository.getLatestTap(it);
                    const widgetIds = await widgetsRepository.getWidgetIdsByItId(it.id);
                    await Promise.all(
                        widgetIds.map((widgetId) =>
                            requestWidgetUpdateById({
                                widgetName: 'It',
                                widgetId,
                                renderWidget: () => <TapWidgIt it={it} latestTap={latestTap} />,
                            }),
                        ),
                    );
                    setSnackbarVisible(true);
                }}
            />
            <Portal>
                <Snackbar visible={isSnackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={500}>
                    <Text style={{ color: 'white' }}>{it.name} was tapped!</Text>
                </Snackbar>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 48,
        padding: 4,
        paddingLeft: 12,
        paddingRight: 12,
    },
});
