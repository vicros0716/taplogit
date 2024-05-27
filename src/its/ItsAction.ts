import {It} from "@/its/It";

type FetchedItsAction = {
    type: 'fetched',
    its: It[]
}
type AddedItAction = {
    type: 'added',
    it: It
}
type DeletedItAction = {
    type: 'deleted',
    itId: number
}
export type ItsAction = FetchedItsAction | AddedItAction | DeletedItAction
