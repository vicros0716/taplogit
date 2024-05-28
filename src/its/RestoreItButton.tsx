import {It} from "@/its/It";
import {IconButton} from "react-native-paper";
import useItsRepository from "@/its/useItsRepository";
import {useContext} from "react";
import {ItsDispatchContext} from "@/its/ItsContext";

export default function RestoreItButton({it}: { it: It }) {
    const itsRepository = useItsRepository();
    const itsDispatch = useContext(ItsDispatchContext);

    return <IconButton icon="delete-restore" onPress={async () => {
        await itsRepository.restoreIt(it.id);
        const its = await itsRepository.getIts(true);
        itsDispatch({
            type: 'fetched',
            its
        })
    }}/>
}