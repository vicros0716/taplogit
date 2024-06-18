import { Dayjs, OpUnitType } from 'dayjs';

export type It = {
    id: number;
    name: string;
    isDeleted: boolean;
    coalesceBy: OpUnitType;
    latestTap: Dayjs | null;
};
