import {createContext, Dispatch} from "react";
import {It} from "@/its/It";
import {ItsAction} from "@/its/ItsAction";

export const ItsContext = createContext<It[]>([]);
export const ItsDispatchContext = createContext<Dispatch<ItsAction>>(null as unknown as Dispatch<ItsAction>);