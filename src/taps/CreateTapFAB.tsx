import {AnimatedFAB} from "react-native-paper";
import CreateTapDialog from "@/taps/CreateTapDialog";
import {useState} from "react";
import {StyleSheet} from "react-native";

export default function CreateTapFAB({extended}: { extended: boolean }) {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <AnimatedFAB icon="plus"
                         label="Create Tap"
                         extended={extended}
                         onPress={() => setVisible(true)}
                         animateFrom="right"
                         style={[styles.fab]}/>
            <CreateTapDialog visible={visible} onDismiss={() => setVisible(false)}/>
        </>
    )
}

const styles = StyleSheet.create({
    fab: {
        bottom: 16,
        right: 16,
        position: 'absolute',
    },
})