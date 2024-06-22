import { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { asValidCoalesceBy, asValidItType, DEFAULT_COALESCE_BY, DEFAULT_IT_TYPE } from '@/its/It';
import { ItDialogContext } from '@/its/ItDialogContext';
import { ItsContext } from '@/its/ItsContext';

export function EditItDialog() {
    const { it, visible, save, hide } = useContext(ItDialogContext);
    const [name, setName] = useState(it?.name ?? '');
    const [type, setType] = useState(it?.type ?? DEFAULT_IT_TYPE);
    const [coalesceBy, setCoalesceBy] = useState(it?.coalesceBy ?? DEFAULT_COALESCE_BY);

    useEffect(() => {
        setName(it?.name ?? '');
        setType(it?.type ?? DEFAULT_IT_TYPE);
        setCoalesceBy(it?.coalesceBy ?? DEFAULT_COALESCE_BY);
    }, [it]);

    const { refreshIts } = useContext(ItsContext);

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
                        onValueChange={(value) => setType(asValidItType(value))}
                    />
                    <Text>Coalesce By</Text>
                    <SegmentedButtons
                        buttons={[
                            { value: 'week', label: 'Week' },
                            { value: 'day', label: 'Day' },
                            { value: 'hour', label: 'Hour' },
                        ]}
                        value={coalesceBy}
                        onValueChange={(value) => setCoalesceBy(asValidCoalesceBy(value))}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hide}>Cancel</Button>
                    <Button
                        onPress={async () => {
                            await save(name.trim(), type, coalesceBy);
                            await refreshIts();
                            hide();
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