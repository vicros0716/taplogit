import {Button, Dialog, TextInput} from "react-native-paper";
import {useContext, useState} from "react";
import useTapsRepository from "@/taps/useTapsRepository";
import {TapsDispatchContext} from "@/taps/TapsContext";

export default function CreateTapDialog({visible, onDismiss}: { visible: boolean, onDismiss: () => void }) {
    const [name, setName] = useState("");
    const tapsDispatch = useContext(TapsDispatchContext);
    const tapRepository = useTapsRepository();

    return (<Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Content>
            <TextInput label="Name" value={name} onChangeText={setName}></TextInput>
        </Dialog.Content>
        <Dialog.Actions>
            <Button onPress={onDismiss}>Cancel</Button>
            <Button onPress={async () => {
                const tap = await tapRepository.createTap(name);
                tapsDispatch({
                    type: 'added',
                    tap
                })
                onDismiss();
                setName("");
            }} mode="contained" disabled={name === ''}>Create</Button>
        </Dialog.Actions>
    </Dialog>)
}
