import {PropsWithChildren, useReducer} from "react";
import {It} from "@/its/It";
import {ItsContext, ItsDispatchContext} from "@/its/ItsContext";
import {ItsAction} from "@/its/ItsAction";

export default function ItsContextProvider(props: PropsWithChildren<{}>) {
    const [its, dispatch] = useReducer(itsReducer, []);

    return (
        <ItsContext.Provider value={its}>
            <ItsDispatchContext.Provider value={dispatch}>
                {props.children}
            </ItsDispatchContext.Provider>
        </ItsContext.Provider>
    )
}

function itsReducer(its: It[], action: ItsAction) {
    switch (action.type) {
        case 'fetched': {
            return action.its;
        }
        case 'added': {
            return [...its, action.it];
        }
        // case 'changed': {
        //     return its.map(t => {
        //         if (t.id === action.task.id) {
        //             return action.task;
        //         } else {
        //             return t;
        //         }
        //     });
        // }
        case 'deleted': {
            return its.filter(it => it.id !== action.itId);
        }
        default: {
            throw Error(`Unknown action: ${action}`);
        }
    }
}
