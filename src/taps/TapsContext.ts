import {createContext, Dispatch} from "react";
import {Tap} from "@/taps/Tap";
import {TapsAction} from "@/taps/TapsAction";

export const TapsContext = createContext<Tap[]>([]);
export const TapsDispatchContext = createContext<Dispatch<TapsAction>>(null as unknown as Dispatch<TapsAction>);