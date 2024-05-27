import {FlatList} from "react-native";
import TapListItem from "@/components/TapListItem";
import {useContext, useEffect} from "react";
import {TapsRepository} from "@/taps/TapsRepository";
import {NativeSyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {NativeScrollEvent} from "react-native/Libraries/Components/ScrollView/ScrollView";
import {useSQLiteContext} from "expo-sqlite";
import {TapsContext, TapsDispatchContext} from "@/taps/TapsContext";

export default function TapsList({onScroll}: { onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void }) {
    const db = useSQLiteContext();
    const taps = useContext(TapsContext);
    const tapsDispatch = useContext(TapsDispatchContext);

    async function setup() {
        const result = await new TapsRepository(db).getTaps();
        tapsDispatch({
            type: 'fetched',
            taps: result,
        })
    }

    useEffect(() => {
        setup()
    }, []);


    return <FlatList data={taps} renderItem={({item}) => (
        <TapListItem tap={item}/>
    )} onScroll={onScroll}>
    </FlatList>

}