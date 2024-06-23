import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { useDialog, useDialogVisible } from '@/its/DialogContext';

export function EditItDialog() {
    const { it, name, setName, type, setType, coalesceBy, setCoalesceBy, save } = useDialog();
    const { visible, hide } = useDialogVisible();

    // TODO(polish): Set a loading indicator after pressing Create
    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={hide}
                theme={{
                    colors: {
                        backdrop: 'rgba(255, 255, 255, 0.4)',
                    },
                }}>
                <Dialog.Title>{it ? `Update ${it.name}` : 'Create It'}</Dialog.Title>
                <Dialog.Content style={styles.dialog}>
                    <TextInput label="Name" value={name} onChangeText={setName}></TextInput>
                    <Text>Type</Text>
                    <SegmentedButtons
                        buttons={[
                            { value: 'tap', label: 'Tap', icon: 'gesture-tap' },
                            { value: 'switch', label: 'Switch', icon: 'toggle-switch-outline' },
                        ]}
                        value={type}
                        onValueChange={setType}
                    />
                    <Text>Coalesce By</Text>
                    <SegmentedButtons
                        buttons={[
                            { value: 'week', label: 'Week' },
                            { value: 'day', label: 'Day' },
                            { value: 'hour', label: 'Hour' },
                        ]}
                        value={coalesceBy}
                        onValueChange={setCoalesceBy}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hide}>Cancel</Button>
                    <Button
                        onPress={async () => {
                            await save();
                        }}
                        mode="contained"
                        disabled={name.trim() === ''}>
                        {it ? 'Update' : 'Create'}
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    dialog: {
        flexDirection: 'column',
        gap: 16,
    },
});
