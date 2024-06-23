import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { IconButton, Portal, Snackbar, Text, useTheme } from 'react-native-paper';
import { NativeScrollEvent } from 'react-native/Libraries/Components/ScrollView/ScrollView';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import DeleteItButton from '@/its/DeleteItButton';
import { useDialogVisible } from '@/its/DialogContext';
import { It } from '@/its/It';
import { useIts, useRefreshIts } from '@/its/ItsContext';
import RestoreItButton from '@/its/RestoreItButton';
import useTapsRepository from '@/taps/useTapsRepository';

export default function ItsList({ onScroll }: { onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void }) {
    const its = useIts();
    const [refreshing, refreshIts] = useRefreshIts();
    const { show } = useDialogVisible();
    const theme = useTheme();

    return (
        <FlatList
            data={its}
            renderItem={({ item: it }) => (
                <Swipeable
                    overshootLeft={false}
                    overshootRight={false}
                    renderRightActions={() =>
                        it.isDeleted ? <RestoreItButton it={it} /> : <DeleteItButton it={it} />
                    }>
                    <ItsListItem it={it} onPress={refreshIts} onLongPress={() => show(it)} />
                </Swipeable>
            )}
            onScroll={onScroll}
            refreshing={refreshing}
            onRefresh={refreshIts}
            style={{ backgroundColor: theme.colors.surface }}
        />
    );
}

function ItsListItem({ it, onPress, onLongPress }: { it: It; onPress: () => void; onLongPress: () => void }) {
    const [isSnackbarVisible, setSnackbarVisible] = useState(false);
    const theme = useTheme();
    const tapsRepository = useTapsRepository();

    return (
        <View style={styles.container}>
            <Link href={`/details/${it.id}`} style={{ flexGrow: 1 }} asChild>
                <Pressable onLongPress={onLongPress}>
                    <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                        {it.name}
                    </Text>
                </Pressable>
            </Link>
            <ItsListItemAction
                it={it}
                onPress={async () => {
                    await tapsRepository.createTap(it);
                    setSnackbarVisible(true);
                    onPress();
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

function ItsListItemAction({ it, onPress }: { it: It; onPress: () => Promise<void> }) {
    const theme = useTheme();

    switch (it.type) {
        case 'tap':
            return <IconButton icon="gesture-tap" iconColor={theme.colors.onSurface} onPress={onPress} />;
        case 'switch':
            const switchOpen = it.numberOfTaps % 2 === 0;
            return (
                <IconButton
                    icon={switchOpen ? 'toggle-switch-off-outline' : 'toggle-switch-outline'}
                    iconColor={theme.colors.onSurface}
                    onPress={onPress}
                />
            );
    }
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
