import { It } from '@/its/It';
import { Dayjs } from 'dayjs';

export type Tap = {
    id: number;
    it: It;
    tappedAt: Dayjs;
};
