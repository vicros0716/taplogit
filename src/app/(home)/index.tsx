import {SafeAreaView, StyleSheet} from 'react-native';
import useScrollExtended from "@/hooks/useScrollExtended";
import CreateItFAB from "@/its/CreateItFAB";
import ItsList from "@/its/ItsList";

export default function HomeScreen() {
    const [isExtended, onScroll] = useScrollExtended();
    return (
        <SafeAreaView style={styles.container}>
            <ItsList onScroll={onScroll}/>
            <CreateItFAB extended={isExtended}/>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
