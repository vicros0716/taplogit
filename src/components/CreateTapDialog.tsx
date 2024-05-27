import {Button, Dialog, DialogProps, TextInput} from "react-native-paper";
import {useState} from "react";

export default function CreateTapDialog(props: Omit<DialogProps, 'children'> & { onCreate: (name: string) => Promise<unknown> }) {
    const [text, setText] = useState("");

    return (<Dialog {...props}>
        <Dialog.Content>
            <TextInput label="Name" value={text} onChangeText={setText}></TextInput>
        </Dialog.Content>
        <Dialog.Actions>
            <Button onPress={props.onDismiss}>Cancel</Button>
            <Button onPress={async () => {
                console.log(text)
                await props.onCreate(text);
                setText("");
            }} mode="contained" disabled={text === ''}>Create</Button>
        </Dialog.Actions>
    </Dialog>)
}
