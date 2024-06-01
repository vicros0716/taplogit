import { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { AnimatedFAB, Button, Dialog, TextInput } from 'react-native-paper';
import { ItsContext } from '@/its/ItsContext';
import useItsRepository from '@/its/useItsRepository';

export default function CreateItFAB({ extended }: { extended: boolean }) {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <AnimatedFAB
                icon="plus"
                label="Create It"
                extended={extended}
                onPress={() => setVisible(true)}
                animateFrom="right"
                style={[styles.fab]}
            />
            <CreateItDialog visible={visible} onDismiss={() => setVisible(false)} />
        </>
    );
}

function CreateItDialog({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
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
                        await itsRepository.createIt(name.trim());
                        await refreshIts();
                        onDismiss();
                        setName('');
                    }}
                    mode="contained"
                    disabled={name.trim() === ''}>
                    Create
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
}

const styles = StyleSheet.create({
    fab: {
        bottom: 16,
        right: 16,
        position: 'absolute',
    },
});
