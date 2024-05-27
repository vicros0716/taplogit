import {FlatList, View} from "react-native";
import {useSQLiteContext} from "expo-sqlite";
import {useEffect, useState} from "react";
import {TapsRepository} from "@/taps/TapsRepository";
import {It} from "@/its/It";
import {Tap} from "@/taps/Tap";
import {Text} from "react-native-paper";

export default function TapsList({it}: { it: It }) {
    const [taps, setTaps] = useState<Tap[]>([]);

    const db = useSQLiteContext();

    async function setup() {
        const result = await new TapsRepository(db).getTaps(it);
        setTaps(result);
    }

    useEffect(() => {
        setup()
    }, []);

    return <FlatList data={taps} renderItem={({item}) => (
        <TapsListItem tap={item}/>
    )}/>
}

function TapsListItem({tap}: { tap: Tap }) {
    return <View>
        <Text>{tap.tappedAt.toISOString()}</Text>
    </View>
}