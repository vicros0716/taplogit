import {useState} from "react";
import {NativeSyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {NativeScrollEvent} from "react-native/Libraries/Components/ScrollView/ScrollView";

export default function useScrollExtended() {
    const [isExtended, setExtended] = useState(true);
    const onScroll = ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setExtended(currentScrollPosition <= 0);
    };
    return [isExtended, onScroll] as const;
}