import {Button, Dialog, TextInput} from "react-native-paper";
import {useContext, useState} from "react";
import useItsRepository from "@/its/useItsRepository";
import {ItsDispatchContext} from "@/its/ItsContext";

export default function CreateItDialog({visible, onDismiss}: { visible: boolean, onDismiss: () => void }) {
    const [name, setName] = useState("");
    const itsDispatch = useContext(ItsDispatchContext);
    const itsRepository = useItsRepository();

    return (<Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Content>
            <TextInput label="Name" value={name} onChangeText={setName}></TextInput>
        </Dialog.Content>
        <Dialog.Actions>
            <Button onPress={onDismiss}>Cancel</Button>
            <Button onPress={async () => {
                const it = await itsRepository.createIt(name);
                itsDispatch({
                    type: 'added',
                    it
                })
                onDismiss();
                setName("");
            }} mode="contained" disabled={name === ''}>Create</Button>
        </Dialog.Actions>
    </Dialog>)
}
