import { Dayjs, ManipulateType } from 'dayjs';

const IT_TYPES = ['tap', 'switch'] as const;
export const DEFAULT_IT_TYPE: ItType = IT_TYPES[0];
export type ItType = (typeof IT_TYPES)[number];

export function asValidItType(type: string): ItType {
    return IT_TYPES.includes(type as ItType) ? (type as ItType) : DEFAULT_IT_TYPE;
}

export const DEFAULT_COALESCE_BY: ManipulateType = 'day';

export function asValidCoalesceBy(coalesceBy: string): ManipulateType {
    return ['week', 'day', 'hour'].includes(coalesceBy) ? (coalesceBy as ManipulateType) : DEFAULT_COALESCE_BY;
}

export type It = {
    id: number;
    name: string;
    isDeleted: boolean;
    type: ItType;
    coalesceBy: ManipulateType;
    latestTap: Dayjs | null;
    numberOfTaps: number;
};
