import useItsRepository from "@/its/useItsRepository";
import {useContext, useState} from "react";
import {ItsDispatchContext} from "@/its/ItsContext";

export default function useFetchIts() {
    const itsRepository = useItsRepository();
    const [refreshing, setRefreshing] = useState(false);
    const itsDispatch = useContext(ItsDispatchContext);

    return [async (includeDeleted = false) => {
        setRefreshing(true);
        const result = await itsRepository.getIts(includeDeleted);
        itsDispatch({
            type: 'fetched',
            its: result,
        })
        setRefreshing(false);

    }, refreshing] as const;
}