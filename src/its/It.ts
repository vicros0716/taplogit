import { Dayjs, OpUnitType } from 'dayjs';

export const IT_TYPES = ['tap', 'switch'] as const;
export const DEFAULT_IT_TYPE = IT_TYPES[0];
export type ItType = (typeof IT_TYPES)[number];

export function isValidItType(itType: string): itType is ItType {
    return IT_TYPES.includes(itType as ItType);
}
export function asValidItType(type: string): ItType {
    return isValidItType(type) ? type : DEFAULT_IT_TYPE;
}

export type It = {
    id: number;
    name: string;
    isDeleted: boolean;
    type: ItType;
    coalesceBy: OpUnitType;
    latestTap: Dayjs | null;
};
