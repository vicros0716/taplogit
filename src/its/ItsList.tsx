import { Link } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Portal, Snackbar, Text } from 'react-native-paper';
import { NativeScrollEvent } from 'react-native/Libraries/Components/ScrollView/ScrollView';
import { NativeSyntheticEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import DeleteItButton from '@/its/DeleteItButton';
import { It } from '@/its/It';
import { ItsContext } from '@/its/ItsContext';
import RestoreItButton from '@/its/RestoreItButton';
import { TapsRepository } from '@/taps/TapsRepository';

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

    return (
        <FlatList
            data={its}
            renderItem={({ item }) => <ItsListItem it={item} />}
            onScroll={onScroll}
            refreshing={refreshing}
            onRefresh={async () => {
                setRefreshing(true);
                await refreshIts();
                setRefreshing(false);
            }}
        />
    );
}

function ItsListItem({ it }: { it: It }) {
    const db = useSQLiteContext();
    const tapsRepository = new TapsRepository(db);
    const [isSnackbarVisible, setSnackbarVisible] = useState(false);

    return (
        <View style={styles.container}>
            <Link href={`/details/${it.id}`} style={{ flexGrow: 1 }}>
                <Text variant="titleLarge">{it.name}</Text>
            </Link>
            <View style={styles.actionsContainer}>
                {it.isDeleted ? <RestoreItButton it={it} /> : <DeleteItButton it={it} />}
                <Button
                    mode="contained"
                    onPress={async () => {
                        await tapsRepository.createTap(it);
                        setSnackbarVisible(true);
                    }}>
                    Tap
                </Button>
                <Portal>
                    <Snackbar visible={isSnackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={500}>
                        <Text style={{ color: 'white' }}>{it.name} was tapped!</Text>
                    </Snackbar>
                </Portal>
            </View>
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
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
    },
});
