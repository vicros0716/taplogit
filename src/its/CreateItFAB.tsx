import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import { ItDialogContext } from '@/its/ItDialogContext';

export default function CreateItFAB({ extended }: { extended: boolean }) {
    const { show } = useContext(ItDialogContext);
    return (
        <AnimatedFAB
            icon="plus"
            label="Create It"
            extended={extended}
            onPress={() => show()}
            animateFrom="right"
            style={[styles.fab]}
        />
    );
}

const styles = StyleSheet.create({
    fab: {
        bottom: 16,
        right: 16,
        position: 'absolute',
    },
});
