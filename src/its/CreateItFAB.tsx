import {AnimatedFAB} from "react-native-paper";
import CreateItDialog from "@/its/CreateItDialog";
import {useState} from "react";
import {StyleSheet} from "react-native";

export default function CreateItFAB({extended}: { extended: boolean }) {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <AnimatedFAB icon="plus"
                         label="Create It"
                         extended={extended}
                         onPress={() => setVisible(true)}
                         animateFrom="right"
                         style={[styles.fab]}/>
            <CreateItDialog visible={visible} onDismiss={() => setVisible(false)}/>
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