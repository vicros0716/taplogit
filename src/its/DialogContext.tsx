import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { asValidCoalesceBy, asValidItType, DEFAULT_COALESCE_BY, DEFAULT_IT_TYPE, It } from '@/its/It';
import { useRefreshIts } from '@/its/ItsContext';
import useItsRepository from '@/its/useItsRepository';

const DialogContext = createContext<{
    it: It | null;
    name: string;
    setName: (name: string) => void;
    type: string;
    setType: (type: string) => void;
    coalesceBy: string;
    setCoalesceBy: (coalesceBy: string) => void;
    save: () => Promise<void>;
}>({
    it: null,
    name: '',
    setName: () => {},
    type: DEFAULT_IT_TYPE,
    setType: () => {},
    coalesceBy: DEFAULT_COALESCE_BY,
    setCoalesceBy: () => {},
    save: async () => {},
});
export const useDialog = () => useContext(DialogContext);

const DialogVisibleContext = createContext<{ visible: boolean; show: (it?: It | null) => void; hide: () => void }>({
    visible: false,
    show: () => {},
    hide: () => {},
});
export const useDialogVisible = () => useContext(DialogVisibleContext);

export function DialogProvider(props: PropsWithChildren<{}>) {
    const itsRepository = useItsRepository();
    const [it, setIt] = useState<It | null>(null);
    const [name, setName] = useState(it?.name ?? '');
    const [type, setType] = useState(it?.type ?? DEFAULT_IT_TYPE);
    const [coalesceBy, setCoalesceBy] = useState(it?.coalesceBy ?? DEFAULT_COALESCE_BY);
    const [visible, setVisible] = useState(false);
    const [, refreshIts] = useRefreshIts();

    useEffect(() => {
        setName(it?.name ?? '');
        setType(it?.type ?? DEFAULT_IT_TYPE);
        setCoalesceBy(it?.coalesceBy ?? DEFAULT_COALESCE_BY);
    }, [it]);

    return (
        <DialogVisibleContext.Provider
            value={{
                visible,
                show: (it: It | null = null) => {
                    setIt(it);
                    setVisible(true);
                },
                hide: () => {
                    setVisible(false);
                },
            }}>
            <DialogContext.Provider
                value={{
                    it,
                    name,
                    setName: setName,
                    type,
                    setType: (type) => setType(asValidItType(type)),
                    coalesceBy,
                    setCoalesceBy: (coalesceBy) => setCoalesceBy(asValidCoalesceBy(coalesceBy)),
                    save: async () => {
                        if (it === null) {
                            await itsRepository.createIt(name.trim(), type, coalesceBy);
                        } else {
                            await itsRepository.updateIt(it.id, name.trim(), type, coalesceBy);
                        }
                        await refreshIts();
                        setVisible(false);
                    },
                }}>
                {props.children}
            </DialogContext.Provider>
        </DialogVisibleContext.Provider>
    );
}
