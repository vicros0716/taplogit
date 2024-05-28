import {FlatList, StyleSheet, View} from "react-native";
import {useContext, useEffect, useState} from "react";
import {ItsRepository} from "@/its/ItsRepository";
import {NativeSyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {NativeScrollEvent} from "react-native/Libraries/Components/ScrollView/ScrollView";
import {useSQLiteContext} from "expo-sqlite";
import {ItsContext, ItsDispatchContext} from "@/its/ItsContext";
import {It} from "@/its/It";
import {TapsRepository} from "@/taps/TapsRepository";
import {Link} from "expo-router";
import {Button, IconButton, Portal, Snackbar, Text} from "react-native-paper";
import DeleteItButton from "@/its/DeleteItButton";

export default function ItsList({onScroll, showArchived}: { onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void, showArchived: boolean }) {
    const db = useSQLiteContext();
    const its = useContext(ItsContext);
    const itsDispatch = useContext(ItsDispatchContext);

    useEffect(() => {
        async function setup() {
            const result = await new ItsRepository(db).getIts(showArchived);
            itsDispatch({
                type: 'fetched',
                its: result,
            })
        }

        setup()
    }, [showArchived]);

    return <FlatList data={its} renderItem={({item}) => (
        <ItsListItem it={item}/>
    )} onScroll={onScroll}/>

}

function ItsListItem({it}: { it: It }) {
    const db = useSQLiteContext();
    const tapsRepository = new TapsRepository(db);
    const [isSnackbarVisible, setSnackbarVisible] = useState(false);

    return <View style={styles.container}>
        <Link href={`/details/${it.id}`}>
            <Text variant="titleLarge">{it.name}</Text>
        </Link>
        <View style={styles.actionsContainer}>
            <DeleteItButton it={it}/>
            <Button mode="contained" onPress={async () => {
                await tapsRepository.createTap(it);
                setSnackbarVisible(true);
            }}>Tap</Button>
            <Portal>
                <Snackbar visible={isSnackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={500}>
                    <Text style={{color: 'white'}}>{it.name} was tapped!</Text>
                </Snackbar>
            </Portal>
        </View>
    </View>
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
        height: 40
    }
});
