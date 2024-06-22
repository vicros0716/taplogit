import dayjs, { ManipulateType } from 'dayjs';
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

export function aggregateAsSwitch(taps: Tap[]) {
    // Sorting earliest to latest simplifies adding current time to fill out the final tap pair if needed.
    // However, we still want to return the pairs from latest to earliest, so reverse it at the end.
    return [...taps]
        .sort((a, b) => a.id - b.id)
        .reduce<[Tap, Tap][]>((acc, tap, currentIndex) => {
            if (currentIndex % 2 === 0) {
                const lastTappedAt = currentIndex + 1 === taps.length;
                return [...acc, (lastTappedAt ? [tap, { id: -1, tappedAt: dayjs() }] : [tap]) as [Tap, Tap]];
            }
            const nextAcc = [...acc];
            const last = nextAcc.pop() as unknown as [Tap];
            nextAcc.push([...last, tap]);
            return nextAcc;
        }, [])
        .toReversed();
}
