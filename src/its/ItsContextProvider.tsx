import { PropsWithChildren, useState } from 'react';
import { It, ItType } from '@/its/It';
import { ItsContext } from '@/its/ItsContext';
import useItsRepository from '@/its/useItsRepository';

export default function ItsContextProvider(props: PropsWithChildren<{}>) {
    const [its, setIts] = useState<It[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const itsRepository = useItsRepository();
    const [dialogIt, setDialogIt] = useState<It | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [onDialogConfirm, setOnDialogConfirm] = useState<(name: string, type: ItType) => Promise<unknown>>(
        async () => {},
    );

    return (
        <ItsContext.Provider
            value={{
                itsRepository,
                its,
                refreshIts: async () => {
                    setIts(await itsRepository.getIts(showDeleted));
                },
                showDeleted,
                setShowDeleted,
                dialogIt,
                dialogVisible,
                onDialogConfirm,
                showDialog: (it: It | null, onConfirm?: (name: string, type: ItType) => Promise<unknown>) => {
                    setDialogIt(it);
                    setDialogVisible(true);
                    setOnDialogConfirm(() => onConfirm ?? (async () => {}));
                },
                hideDialog: () => {
                    setDialogVisible(false);
                },
            }}>
            {props.children}
        </ItsContext.Provider>
    );
}
