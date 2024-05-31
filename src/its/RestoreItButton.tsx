import {It} from "@/its/It";
import {IconButton} from "react-native-paper";
import useItsRepository from "@/its/useItsRepository";
import useFetchIts from "@/its/useFetchIts";

export default function RestoreItButton({it}: { it: It }) {
    const itsRepository = useItsRepository();
    const [fetchIts] = useFetchIts();

    return <IconButton icon="delete-restore" onPress={async () => {
        await itsRepository.restoreIt(it.id);
        await fetchIts(true);
    }}/>
}