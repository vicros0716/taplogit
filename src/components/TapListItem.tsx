import {StyleSheet, View} from "react-native";
import {Text} from 'react-native-paper';
import {Link} from "expo-router";
import {Tap} from "@/taps/Tap";

type Props = {
    tap: Tap
}

export default function TapListItem({tap}: Props) {
    return <View style={styles.container}>
        <Link href={`/tapDetails/${tap.id}`}>
            <Text variant="titleLarge">{tap.name}</Text>
        </Link>
    </View>
}

const styles = StyleSheet.create({
    container: {
        height: 48
    },
});
