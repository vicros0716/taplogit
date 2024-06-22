import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { AnimatedFAB } from 'react-native-paper';
import { ItsContext } from '@/its/ItsContext';

export default function CreateItFAB({ extended }: { extended: boolean }) {
    const { itsRepository, showDialog } = useContext(ItsContext);
    return (
        <AnimatedFAB
            icon="plus"
            label="Create It"
            extended={extended}
            onPress={() => showDialog(null, (name, type) => itsRepository.createIt(name, type))}
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
