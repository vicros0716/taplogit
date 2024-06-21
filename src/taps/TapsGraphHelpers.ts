import dayjs, { Dayjs, ManipulateType } from 'dayjs';
import { Tap } from '@/taps/Tap';

export function asTapData(taps: Tap[], coalesceBy: ManipulateType) {
    const aggregatedTaps = taps
        .map((tap) => tap.tappedAt.tz().startOf(coalesceBy).unix().toString())
        .reduce<{ [timestampString: string]: number }>(
            (acc, tappedAtTimestampString) => ({
                ...acc,
                [tappedAtTimestampString]: (acc[tappedAtTimestampString] ?? 0) + 1,
            }),
            {},
        );
    return Object.entries(aggregatedTaps).map(([timestampString, count]) => ({
        x: dayjs.unix(parseInt(timestampString)).toDate(),
        y: count,
    }));
}

export function asSwitchData(taps: Tap[], coalesceBy: ManipulateType) {
    const aggregatedTaps = taps
        .map((tap) => tap.tappedAt.tz())
        .reduce<[Dayjs, Dayjs][]>((acc, tappedAt, currentIndex) => {
            if (currentIndex % 2 === 0) {
                const lastTappedAt = currentIndex + 1 === taps.length;
                return [...acc, (lastTappedAt ? [tappedAt, dayjs()] : [tappedAt]) as [Dayjs, Dayjs]];
            }
            const nextAcc = [...acc];
            const last = nextAcc.pop() as unknown as [Dayjs];
            nextAcc.push([...last, tappedAt]);
            return nextAcc;
        }, [])
        .map<{ [dateTimestampString: string]: number }>(([startTappedAt, endTappedAt]) => {
            const startTappedAtDate = startTappedAt.startOf(coalesceBy);
            const endTappedAtDate = endTappedAt.startOf(coalesceBy);
            const startTappedAtTimestampString = startTappedAtDate.unix().toString();
            if (startTappedAtDate.isSame(endTappedAtDate)) {
                return { [startTappedAtTimestampString]: endTappedAt.diff(startTappedAt, 'minute') };
            }
            // Start and end on separate days
            const endTappedAtTimestampString = endTappedAtDate.unix().toString();
            const minutesByDate = {
                [startTappedAtTimestampString]: startTappedAtDate.endOf(coalesceBy).diff(startTappedAt, 'minute'), // startTappedAt to end of startTappedAt's day
                [endTappedAtTimestampString]: endTappedAt.diff(endTappedAtDate, 'minute'), // start of endTappedAt's day to endTappedAt
            };
            // If startTappedAtDate and endTappedAtDate are not adjacent dates, then add a full duration of minutes for all durations between them.
            for (
                let nextStartDate = startTappedAtDate.add(1, coalesceBy);
                nextStartDate.isBefore(endTappedAtDate);
                nextStartDate = nextStartDate.add(1, coalesceBy)
            ) {
                minutesByDate[nextStartDate.unix().toString()] = dayjs.duration(1, coalesceBy).asMinutes();
            }

            return minutesByDate;
        })
        .reduce<{ [timestampString: string]: number }>((acc, minutesByDate) => {
            const nextAcc = { ...acc };
            Object.entries(minutesByDate).forEach(([date, minute]) => {
                nextAcc[date] = (nextAcc[date] ?? 0) + minute;
            });
            return nextAcc;
        }, {});
    return Object.entries(aggregatedTaps).map(([timestampString, minutes]) => ({
        x: dayjs.unix(parseInt(timestampString)).toDate(),
        y: minutes,
    }));
}
