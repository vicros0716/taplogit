import {SafeAreaView, StyleSheet} from 'react-native';
import useScrollExtended from "@/hooks/useScrollExtended";
import CreateItFAB from "@/its/CreateItFAB";
import ItsList from "@/its/ItsList";
import {Stack} from "expo-router";
import {Switch, Text} from "react-native-paper";
import {useContext} from "react";
import {ItsContext} from "@/its/ItsContext";

export default function HomeScreen() {
    const [isExtended, onScroll] = useScrollExtended();
    const {showDeleted, setShowDeleted} = useContext(ItsContext);
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                title: 'Tap Log It',
                headerRight: () => <>
                    <Text style={{color: 'white'}}>Show Deleted</Text>
                    <Switch value={showDeleted} onValueChange={setShowDeleted}/>
                </>
            }}/>
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
