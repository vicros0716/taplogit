import {FlatList} from "react-native";
import ItListItem from "@/its/ItListItem";
import {useContext, useEffect} from "react";
import {ItsRepository} from "@/its/ItsRepository";
import {NativeSyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {NativeScrollEvent} from "react-native/Libraries/Components/ScrollView/ScrollView";
import {useSQLiteContext} from "expo-sqlite";
import {ItsContext, ItsDispatchContext} from "@/its/ItsContext";

export default function ItsList({onScroll}: { onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void }) {
    const db = useSQLiteContext();
    const its = useContext(ItsContext);
    const itsDispatch = useContext(ItsDispatchContext);

    async function setup() {
        const result = await new ItsRepository(db).getIts();
        itsDispatch({
            type: 'fetched',
            its: result,
        })
    }

    useEffect(() => {
        setup()
    }, []);


    return <FlatList data={its} renderItem={({item}) => (
        <ItListItem it={item}/>
    )} onScroll={onScroll}>
    </FlatList>

}