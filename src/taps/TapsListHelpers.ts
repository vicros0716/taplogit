import { ManipulateType } from 'dayjs';
import { Tap } from '@/taps/Tap';

export function aggregateAsTaps(taps: Tap[], coalesceBy: ManipulateType) {
    return taps.reduce<{ [key: string]: Tap[] }>((acc, tap) => {
        const tappedAtISOString = tap.tappedAt.startOf(coalesceBy).toISOString();
        return {
            ...acc,
            [tappedAtISOString]: [...(acc[tappedAtISOString] ?? []), tap],
        };
    }, {});
}
