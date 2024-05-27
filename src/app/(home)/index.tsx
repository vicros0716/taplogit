import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {AnimatedFAB} from "react-native-paper";
import TapItem from "@/components/TapItem";
import useScrollExtended from "@/hooks/useScrollExtended";
import {useEffect, useState} from "react";
import {useSQLiteContext} from "expo-sqlite";
import {TapRepository} from "@/app/db/TapRepository";
import CreateTapDialog from "@/components/CreateTapDialog";

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
    const tapRepository = new TapRepository(db);
    const [taps, setTaps] = useState<Tap[]>(defaultTaps);
    useEffect(() => {
        async function setup() {
            const result = await db.getAllAsync<Tap>('SELECT * from taps');
            console.log(result);
            setTaps(result);
        }

        setup()
    }, []);
    const [visible, setVisible] = useState(false);
    return (
        <SafeAreaView style={styles.container}>
            <FlatList data={taps} renderItem={({item}) => (
                <TapItem tap={item}/>
            )} onScroll={onScroll}>
            </FlatList>
            <AnimatedFAB icon="plus"
                         label="Create Tap"
                         extended={isExtended}
                         onPress={() => setVisible(true)}
                         animateFrom="right"
                         style={[styles.fabStyle]}/>
            <CreateTapDialog visible={visible} onDismiss={() => setVisible(false)}
                             onCreate={async (name) => {
                                 console.log(`getting ${name} in index.tsx`)
                                 let sqLiteRunResult = await tapRepository.createTap(name);
                                 setTaps([...taps, {id: sqLiteRunResult.lastInsertRowId, name}])
                                 setVisible(false);
                             }}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
    },
});
