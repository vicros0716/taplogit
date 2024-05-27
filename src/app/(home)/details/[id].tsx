import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import {useContext} from "react";
import {ItsContext} from "@/its/ItsContext";

export default function ItDetailsScreen() {
    const { id } = useLocalSearchParams();
    const its = useContext(ItsContext);
    const it = its.find((it) => it.id.toString() === id);

    return (
        <View style={styles.container}>
            <Text>{id} {it?.name} </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
