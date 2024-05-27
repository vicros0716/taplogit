import {PropsWithChildren, useReducer} from "react";
import {Tap} from "@/taps/Tap";
import {TapsContext, TapsDispatchContext} from "@/taps/TapsContext";
import {TapsAction} from "@/taps/TapsAction";

export default function TapsContextProvider(props: PropsWithChildren<{}>) {
    const [taps, dispatch] = useReducer(tapsReducer, []);

    return (
        <TapsContext.Provider value={taps}>
            <TapsDispatchContext.Provider value={dispatch}>
                {props.children}
            </TapsDispatchContext.Provider>
        </TapsContext.Provider>
    )
}

function tapsReducer(taps: Tap[], action: TapsAction) {
    switch (action.type) {
        case 'fetched': {
            return action.taps;
        }
        case 'added': {
            return [...taps, action.tap];
        }
        // case 'changed': {
        //     return taps.map(t => {
        //         if (t.id === action.task.id) {
        //             return action.task;
        //         } else {
        //             return t;
        //         }
        //     });
        // }
        case 'deleted': {
            return taps.filter(tap => tap.id !== action.tapId);
        }
        default: {
            throw Error(`Unknown action: ${action}`);
        }
    }
}
