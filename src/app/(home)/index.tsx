import {SafeAreaView, StyleSheet} from 'react-native';
import useScrollExtended from "@/hooks/useScrollExtended";
import CreateTapFAB from "@/taps/CreateTapFAB";
import TapsList from "@/taps/TapsList";
import TapsContextProvider from "@/taps/TapsContextProvider";

export default function HomeScreen() {
    const [isExtended, onScroll] = useScrollExtended();
    return (
        <TapsContextProvider>
            <SafeAreaView style={styles.container}>
                <TapsList onScroll={onScroll}/>
                <CreateTapFAB extended={isExtended}/>
            </SafeAreaView>
        </TapsContextProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
