import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function TapDetailsScreen() {
    const { id } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text>Tap {id} </Text>
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
