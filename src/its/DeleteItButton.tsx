import {Button, Dialog, IconButton, Portal, Text} from "react-native-paper";
import {useContext, useState} from "react";
import {It} from "@/its/It";
import useItsRepository from "@/its/useItsRepository";
import {ItsDispatchContext} from "@/its/ItsContext";

export default function DeleteItButton({it}: { it: It }) {
    const itsRepository = useItsRepository();
    const itsDispatch = useContext(ItsDispatchContext);
    const [visible, setVisible] = useState(false);
    return <><IconButton icon="delete" onPress={() => setVisible(true)}/>
        <Portal>
            <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                <Dialog.Content>
                    <Text>Are you certain you want to delete {it.name}? You will lose all history</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setVisible(false)}>Cancel</Button>
                    <Button onPress={async () => {
                        await itsRepository.deleteIt(it.id);
                        itsDispatch({
                            type: 'deleted',
                            itId: it.id,
                        })
                        setVisible(false);
                    }} mode="contained">Delete</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    </>
}