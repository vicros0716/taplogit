import { OpUnitType } from 'dayjs';

export type It = {
    id: number;
    name: string;
    isDeleted: boolean;
    coalesceBy: OpUnitType;
};
