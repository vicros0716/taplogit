import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {AnimatedFAB} from "react-native-paper";
import {useState} from "react";
import {NativeScrollEvent} from "react-native/Libraries/Components/ScrollView/ScrollView";
import {NativeSyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";
import TapItem from "@/components/TapItem";

export default function HomeScreen() {
    const [isExtended, onScroll] = useScrollExtended();
    return (
        <SafeAreaView>
            <ScrollView onScroll={onScroll}>
                {[...new Array(100).keys()].map((_, i) => (
                    <TapItem key={i} tap={{id: i, name: `foo ${i}`}}/>
                ))}
            </ScrollView>
            <AnimatedFAB icon="plus"
                         label="Label"
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
