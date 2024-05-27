import {StyleSheet, View} from "react-native";
import {Text} from 'react-native-paper';
import {Link} from "expo-router";
import {It} from "@/its/It";

type Props = {
    it: It
}

export default function ItListItem({it}: Props) {
    return <View style={styles.container}>
        <Link href={`/details/${it.id}`}>
            <Text variant="titleLarge">{it.name}</Text>
        </Link>
    </View>
}

const styles = StyleSheet.create({
    container: {
        height: 48
    },
});
