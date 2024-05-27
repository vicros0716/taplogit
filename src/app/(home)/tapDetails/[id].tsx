import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import {useContext} from "react";
import {TapsContext} from "@/taps/TapsContext";

export default function TapDetailsScreen() {
    const { id } = useLocalSearchParams();
    const taps = useContext(TapsContext);
    const tap = taps.find((tap) => tap.id.toString() === id);

    return (
        <View style={styles.container}>
            <Text>{id} {tap?.name} </Text>
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
