import {createContext} from "react";
import {It} from "@/its/It";

export const ItsContext = createContext<{
    its: It[], refreshIts: () => Promise<void>, showDeleted: boolean,
    setShowDeleted: (showDeleted: boolean) => void
}>({
    its: [],
    refreshIts: async () => {
    },
    showDeleted: false,
    setShowDeleted: () => {
    }
});