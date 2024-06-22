import { ItDialogContext } from './ItDialogContext';
import { PropsWithChildren, useState } from 'react';
import { It } from '@/its/It';
import useItsRepository from '@/its/useItsRepository';

export default function ItDialogContextProvider(props: PropsWithChildren<{}>) {
    const itsRepository = useItsRepository();
    const [it, setIt] = useState<It | null>(null);
    const [visible, setVisible] = useState(false);

    return (
        <ItDialogContext.Provider
            value={{
                it,
                visible,
                save: async (name, type, coalesceBy) => {
                    if (it === null) {
                        await itsRepository.createIt(name, type, coalesceBy);
                    } else {
                        await itsRepository.updateIt(it.id, name, type, coalesceBy);
                    }
                },
                show: (it: It | null = null) => {
                    setIt(it);
                    setVisible(true);
                },
                hide: () => {
                    setVisible(false);
                },
            }}>
            {props.children}
        </ItDialogContext.Provider>
    );
}
