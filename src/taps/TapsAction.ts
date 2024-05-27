import {Tap} from "@/taps/Tap";

type FetchedTapsAction = {
    type: 'fetched',
    taps: Tap[]
}
type AddedTapAction = {
    type: 'added',
    tap: Tap
}
type DeletedTapAction = {
    type: 'deleted',
    tapId: number
}
export type TapsAction = FetchedTapsAction | AddedTapAction | DeletedTapAction
