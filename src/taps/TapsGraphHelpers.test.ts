import dayjs, { ManipulateType } from 'dayjs';
import Duration from 'dayjs/plugin/duration';
import Timezone from 'dayjs/plugin/timezone';
import UTC from 'dayjs/plugin/utc';
import MockDate from 'mockdate';
import { Tap } from '@/taps/Tap';
import { aggregateAsSwitch, aggregateAsTaps } from '@/taps/TapsGraphHelpers';

beforeAll(() => {
    dayjs.extend(UTC);
    dayjs.extend(Timezone);
    dayjs.extend(Duration);
    dayjs.tz.setDefault('America/Los_Angeles');
    MockDate.set(new Date('2024-06-07T06:39:26.123Z'));
});

afterAll(() => {
    MockDate.reset();
});

let taps: Tap[] = [];

beforeEach(() => {
    taps = [
        { id: 12, tappedAt: dayjs('2024-06-07T05:11:52.000Z') },
        { id: 11, tappedAt: dayjs('2024-06-07T04:21:28.000Z') },
        { id: 10, tappedAt: dayjs('2024-06-06T17:40:02.000Z') },
        { id: 9, tappedAt: dayjs('2024-06-04T02:23:10.000Z') },
        { id: 8, tappedAt: dayjs('2024-06-03T18:57:11.000Z') },
        { id: 7, tappedAt: dayjs('2024-06-02T21:13:43.000Z') },
        { id: 6, tappedAt: dayjs('2024-06-01T03:42:27.000Z') },
        { id: 5, tappedAt: dayjs('2024-05-29T19:29:39.000Z') },
        { id: 4, tappedAt: dayjs('2024-05-29T16:34:55.000Z') },
        { id: 3, tappedAt: dayjs('2024-05-29T07:20:21.000Z') },
        { id: 2, tappedAt: dayjs('2024-05-27T11:54:49.000Z') },
        { id: 1, tappedAt: dayjs('2024-05-27T05:12:45.000Z') },
        { id: 0, tappedAt: dayjs('2024-05-26T10:23:38.000Z') },
    ];
});

describe('aggregateAsTaps', () => {
    it.each<{ coalescedBy: ManipulateType; expected: { [key: string]: number } }>([
        {
            coalescedBy: 'day',
            expected: {
                [dayjs('2024-06-06T07:00:00.000Z').unix().toString()]: 3,
                [dayjs('2024-06-03T07:00:00.000Z').unix().toString()]: 2,
                [dayjs('2024-06-02T07:00:00.000Z').unix().toString()]: 1,
                [dayjs('2024-05-31T07:00:00.000Z').unix().toString()]: 1,
                [dayjs('2024-05-29T07:00:00.000Z').unix().toString()]: 3,
                [dayjs('2024-05-27T07:00:00.000Z').unix().toString()]: 1,
                [dayjs('2024-05-26T07:00:00.000Z').unix().toString()]: 2,
            },
        },
        {
            coalescedBy: 'week',
            expected: {
                [dayjs('2024-06-02T07:00:00.000Z').unix().toString()]: 6,
                [dayjs('2024-05-26T07:00:00.000Z').unix().toString()]: 7,
            },
        },
        {
            coalescedBy: 'month',
            expected: {
                [dayjs('2024-06-01T07:00:00.000Z').unix().toString()]: 6,
                [dayjs('2024-05-01T07:00:00.000Z').unix().toString()]: 7,
            },
        },
    ])('coalesces taps by $coalescedBy', ({ coalescedBy, expected }) => {
        const data = aggregateAsTaps(taps, coalescedBy);
        expect(data).toEqual(expected);
    });
});

describe('aggregateAsSwitch', () => {
    it.each<{ coalescedBy: ManipulateType; expected: { [key: string]: number } }>([
        {
            coalescedBy: 'day',
            expected: {
                [dayjs('2024-06-06T07:00:00.000Z').unix().toString()]: 728,
                [dayjs('2024-06-03T07:00:00.000Z').unix().toString()]: 445,
                [dayjs('2024-06-02T07:00:00.000Z').unix().toString()]: 853,
                [dayjs('2024-06-01T07:00:00.000Z').unix().toString()]: 1440,
                [dayjs('2024-05-31T07:00:00.000Z').unix().toString()]: 197,
                [dayjs('2024-05-29T07:00:00.000Z').unix().toString()]: 194,
                [dayjs('2024-05-28T07:00:00.000Z').unix().toString()]: 1440,
                [dayjs('2024-05-27T07:00:00.000Z').unix().toString()]: 1145,
                [dayjs('2024-05-26T07:00:00.000Z').unix().toString()]: 1129,
            },
        },
        {
            coalescedBy: 'week',
            expected: {
                [dayjs('2024-06-02T07:00:00.000Z').unix().toString()]: 2026,
                [dayjs('2024-05-26T07:00:00.000Z').unix().toString()]: 5545,
            },
        },
        {
            coalescedBy: 'month',
            expected: {
                [dayjs('2024-06-01T07:00:00.000Z').unix().toString()]: 3466,
                [dayjs('2024-05-01T07:00:00.000Z').unix().toString()]: 4105,
            },
        },
    ])('coalesces switch durations by $coalescedBy', ({ coalescedBy, expected }) => {
        const data = aggregateAsSwitch(taps, coalescedBy);
        expect(data).toEqual(expected);
    });
});
