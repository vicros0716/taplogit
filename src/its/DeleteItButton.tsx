import {Button, Dialog, IconButton, Portal, Text} from "react-native-paper";
import {useContext, useState} from "react";
import {It} from "@/its/It";
import useItsRepository from "@/its/useItsRepository";
import {ItsDispatchContext} from "@/its/ItsContext";
import {getSQLiteErrorCode} from "@/db/getSQLiteErrorCode";

export default function DeleteItButton({it}: { it: It }) {
    const itsRepository = useItsRepository();
    const itsDispatch = useContext(ItsDispatchContext);
    const [visible, setVisible] = useState(false);
    const [errorCode, setErrorCode] = useState('');
    const dismiss = () => {
        setVisible(false);
        setErrorCode('');
    }
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
                            itsDispatch({
                                type: 'deleted',
                                itId: it.id,
                            })
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