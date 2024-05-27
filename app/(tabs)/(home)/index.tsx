import { View, Text, StyleSheet } from 'react-native';
import {Link} from "expo-router";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text>Home</Text>
            <Link href="/details/1">View first user details</Link>
            <Link href="/details/2">View second user details</Link>
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