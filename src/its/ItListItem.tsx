import {StyleSheet, View} from "react-native";
import {Button, Text} from 'react-native-paper';
import {Link} from "expo-router";
import {It} from "@/its/It";
import {useSQLiteContext} from "expo-sqlite";
import {TapsRepository} from "@/taps/TapsRepository";

export default function ItListItem({it}: { it: It }) {
    const db = useSQLiteContext();
    const tapsRepository = new TapsRepository(db);
    return <View style={styles.container}>
        <Link href={`/details/${it.id}`}>
            <Text variant="titleLarge">{it.name}</Text>
        </Link>
        <Button mode="contained" onPress={() => tapsRepository.createTap(it)}>Tap</Button>
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
});
