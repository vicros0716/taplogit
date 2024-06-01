import { useContext } from 'react';
import { IconButton } from 'react-native-paper';
import { It } from '@/its/It';
import { ItsContext } from '@/its/ItsContext';
import useItsRepository from '@/its/useItsRepository';

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
