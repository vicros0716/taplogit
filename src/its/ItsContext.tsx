import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { It } from '@/its/It';
import useItsRepository from '@/its/useItsRepository';

const ItsContext = createContext<It[]>([]);
export const useIts = () => useContext(ItsContext);

const RefreshItsContext = createContext<[boolean, () => Promise<void>]>([false, async () => {}]);
export const useRefreshIts = () => useContext(RefreshItsContext);

const DeletedVisibleContext = createContext<[boolean, (deletedVisible: boolean) => void]>([false, async () => {}]);
export const useDeletedVisible = () => useContext(DeletedVisibleContext);

export function ItsProvider(props: PropsWithChildren<{}>) {
    const itsRepository = useItsRepository();
    const [its, setIts] = useState<It[]>([]);
    const [deletedVisible, setDeletedVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const refresh = useCallback(async () => {
        setRefreshing(true);
        setIts(await itsRepository.getIts(deletedVisible));
        setRefreshing(false);
    }, [deletedVisible]);

    useEffect(() => {
        refresh();
    }, [deletedVisible]);

    return (
        <ItsContext.Provider value={its}>
            <DeletedVisibleContext.Provider value={[deletedVisible, setDeletedVisible]}>
                <RefreshItsContext.Provider value={[refreshing, refresh]}>{props.children}</RefreshItsContext.Provider>
            </DeletedVisibleContext.Provider>
        </ItsContext.Provider>
    );
}
