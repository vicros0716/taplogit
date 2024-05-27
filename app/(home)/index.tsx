import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {AnimatedFAB} from "react-native-paper";
import TapItem from "@/components/TapItem";
import useScrollExtended from "@/hooks/useScrollExtended";
import {useEffect, useState} from "react";
import {useSQLiteContext} from "expo-sqlite";

type Tap = {
    id: number;
    name: string;
}

export default function HomeScreen() {
    const db = useSQLiteContext();
    const [isExtended, onScroll] = useScrollExtended();
    const defaultTaps = [...new Array(30).keys()].map((_, i) => (
        {id: i, name: `bar ${i}`}
    ))
    const [taps, setTaps] = useState<Tap[]>(defaultTaps);
    useEffect(() => {
        async function setup() {
            const result = await db.getAllAsync<Tap>('SELECT * from taps');
            setTaps(result);
        }

        setup()
    }, []);
    return (
        <SafeAreaView>
            <FlatList data={taps} renderItem={({item}) => (
                <TapItem tap={item}/>
            )} onScroll={onScroll}>
            </FlatList>
            <AnimatedFAB icon="plus"
                         label="Create Tap"
                         extended={isExtended}
                         onPress={() => console.info('Pressed')}
                         animateFrom="right"
                         style={[styles.fabStyle]}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
    },
});
