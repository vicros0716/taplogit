import {PropsWithChildren, useState} from "react";
import {It} from "@/its/It";
import {ItsContext} from "@/its/ItsContext";
import useItsRepository from "@/its/useItsRepository";

export default function ItsContextProvider(props: PropsWithChildren<{}>) {
    const [its, setIts] = useState<It[]>([]);
    const [showDeleted, setShowDeleted] = useState(false);
    const itsRepository = useItsRepository();

    return <ItsContext.Provider value={{
        its,
        refreshIts: async () => {
            setIts(await itsRepository.getIts(showDeleted));
        },
        showDeleted,
        setShowDeleted
    }}>{props.children}</ItsContext.Provider>
}
