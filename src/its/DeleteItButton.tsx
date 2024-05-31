import {Button, Dialog, IconButton, Portal, Text} from "react-native-paper";
import {useContext, useState} from "react";
import {It} from "@/its/It";
import useItsRepository from "@/its/useItsRepository";
import {getSQLiteErrorCode} from "@/db/getSQLiteErrorCode";
import {ItsContext} from "@/its/ItsContext";

export default function DeleteItButton({it}: { it: It }) {
    const itsRepository = useItsRepository();
    const {refreshIts} = useContext(ItsContext);
    const [visible, setVisible] = useState(false);
    const [errorCode, setErrorCode] = useState('');
    const dismiss = () => {
        setVisible(false);
        setErrorCode('');
    }
    // TODO(polish): Set a loading indicator after pressing Delete
    return <>
        <IconButton icon="delete" onPress={() => setVisible(true)}/>
        <Portal>
            <Dialog visible={visible} onDismiss={dismiss}>
                <Dialog.Content>
                    <Text>Are you certain you want to delete {it.name}? You will lose all history</Text>
                    <Text
                        style={{color: 'red'}}>{errorCode === 'FOREIGN KEY constraint failed' ? `Cannot delete ${it.name} because of existing taps` : errorCode}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={dismiss}>Cancel</Button>
                    <Button onPress={async () => {
                        try {
                            await itsRepository.deleteIt(it.id);
                            await refreshIts();
                            dismiss();
                        } catch (error: unknown) {
                            setErrorCode(getSQLiteErrorCode(error));
                        }
                    }} mode="contained">Delete</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    </>
}