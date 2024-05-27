import {StyleSheet, View} from "react-native";
import {Text, TouchableRipple} from 'react-native-paper';
import {Link} from "expo-router";

type Props = {
    tap: {
        id: number;
        name: string;
    }
}

export default function TapItem({tap}: Props) {
    return <TouchableRipple style={styles.container} onPress={() => console.log(tap)}><View>
        <Link href={`/tapDetails/${tap.id}`}>
            <Text variant="titleLarge">{tap.name}</Text>
        </Link>
    </View></TouchableRipple>
}

const styles = StyleSheet.create({
    container: {
        height: 48
    },
});
