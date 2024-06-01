import { Dayjs } from 'dayjs';
import { It } from '@/its/It';

export type Tap = {
    id: number;
    it: It;
    tappedAt: Dayjs;
};
