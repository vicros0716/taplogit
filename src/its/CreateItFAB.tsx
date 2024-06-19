import { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { AnimatedFAB, Button, Dialog, SegmentedButtons, TextInput } from 'react-native-paper';
import { asValidItType, DEFAULT_IT_TYPE, ItType } from '@/its/It';
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
    const [type, setType] = useState<ItType>(DEFAULT_IT_TYPE);
    const { refreshIts } = useContext(ItsContext);
    const itsRepository = useItsRepository();

    // TODO(polish): Set a loading indicator after pressing Create
    return (
        <Dialog visible={visible} onDismiss={onDismiss}>
            <Dialog.Title>Create It</Dialog.Title>
            <Dialog.Content style={styles.dialog}>
                <TextInput label="Name" value={name} onChangeText={setName}></TextInput>
                <SegmentedButtons
                    buttons={[
                        { value: 'tap', label: 'Tap', icon: 'gesture-tap' },
                        { value: 'switch', label: 'Switch', icon: 'toggle-switch-outline' },
                    ]}
                    value={type}
                    onValueChange={async (value) => {
                        setType(asValidItType(value));
                    }}
                />
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={onDismiss}>Cancel</Button>
                <Button
                    onPress={async () => {
                        await itsRepository.createIt(name.trim(), type);
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
    dialog: {
        flexDirection: 'column',
        gap: 16,
    },
});
