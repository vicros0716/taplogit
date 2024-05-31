import { It } from '@/its/It';
import { IconButton } from 'react-native-paper';
import useItsRepository from '@/its/useItsRepository';
import { useContext } from 'react';
import { ItsContext } from '@/its/ItsContext';

export default function RestoreItButton({ it }: { it: It }) {
    const itsRepository = useItsRepository();
    const { refreshIts } = useContext(ItsContext);

    // TODO(polish): Set a loading indicator after pressing Restore
    return (
        <IconButton
            icon="delete-restore"
            onPress={async () => {
                await itsRepository.restoreIt(it.id);
                await refreshIts();
            }}
        />
    );
}
