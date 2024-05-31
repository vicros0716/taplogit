import { Button, Dialog, TextInput } from 'react-native-paper';
import { useContext, useState } from 'react';
import { ItsContext } from '@/its/ItsContext';
import useItsRepository from '@/its/useItsRepository';

export default function CreateItDialog({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
    const [name, setName] = useState('');
    const { refreshIts } = useContext(ItsContext);
    const itsRepository = useItsRepository();

    // TODO(polish): Set a loading indicator after pressing Create
    return (
        <Dialog visible={visible} onDismiss={onDismiss}>
            <Dialog.Content>
                <TextInput label="Name" value={name} onChangeText={setName}></TextInput>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={onDismiss}>Cancel</Button>
                <Button
                    onPress={async () => {
                        await itsRepository.createIt(name);
                        await refreshIts();
                        onDismiss();
                        setName('');
                    }}
                    mode="contained"
                    disabled={name === ''}>
                    Create
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
}
