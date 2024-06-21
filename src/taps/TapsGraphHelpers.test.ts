import dayjs, { ManipulateType } from 'dayjs';
import Duration from 'dayjs/plugin/duration';
import Timezone from 'dayjs/plugin/timezone';
import UTC from 'dayjs/plugin/utc';
import MockDate from 'mockdate';
import { Tap } from '@/taps/Tap';
import { asSwitchData, asTapData } from '@/taps/TapsGraphHelpers';

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
        { id: 0, tappedAt: dayjs('2024-05-26T10:23:38.000Z') },
        { id: 1, tappedAt: dayjs('2024-05-27T05:12:45.000Z') },
        { id: 2, tappedAt: dayjs('2024-05-27T11:54:49.000Z') },
        { id: 3, tappedAt: dayjs('2024-05-29T07:20:21.000Z') },
        { id: 4, tappedAt: dayjs('2024-05-29T16:34:55.000Z') },
        { id: 5, tappedAt: dayjs('2024-05-29T19:29:39.000Z') },
        { id: 6, tappedAt: dayjs('2024-06-01T03:42:27.000Z') },
        { id: 7, tappedAt: dayjs('2024-06-02T21:13:43.000Z') },
        { id: 8, tappedAt: dayjs('2024-06-03T18:57:11.000Z') },
        { id: 9, tappedAt: dayjs('2024-06-04T02:23:10.000Z') },
        { id: 10, tappedAt: dayjs('2024-06-06T17:40:02.000Z') },
        { id: 11, tappedAt: dayjs('2024-06-07T04:21:28.000Z') },
        { id: 12, tappedAt: dayjs('2024-06-07T05:11:52.000Z') },
    ];
});

describe('asTapData', () => {
    it.each([
        {
            coalescedBy: 'day',
            expected: [
                { x: new Date('2024-05-26T07:00:00.000Z'), y: 2 },
                { x: new Date('2024-05-27T07:00:00.000Z'), y: 1 },
                { x: new Date('2024-05-29T07:00:00.000Z'), y: 3 },
                { x: new Date('2024-05-31T07:00:00.000Z'), y: 1 },
                { x: new Date('2024-06-02T07:00:00.000Z'), y: 1 },
                { x: new Date('2024-06-03T07:00:00.000Z'), y: 2 },
                { x: new Date('2024-06-06T07:00:00.000Z'), y: 3 },
            ],
        },
        {
            coalescedBy: 'week',
            expected: [
                { x: new Date('2024-05-26T07:00:00.000Z'), y: 7 },
                { x: new Date('2024-06-02T07:00:00.000Z'), y: 6 },
            ],
        },
        {
            coalescedBy: 'month',
            expected: [
                { x: new Date('2024-05-01T07:00:00.000Z'), y: 7 },
                { x: new Date('2024-06-01T07:00:00.000Z'), y: 6 },
            ],
        },
    ])('properly aggregates when coalesced by $coalescedBy', ({ coalescedBy, expected }) => {
        const data = asTapData(taps, coalescedBy as ManipulateType);
        expect(data).toEqual(expected);
    });
});

describe('asSwitchData', () => {
    it.each([
        {
            coalescedBy: 'day',
            expected: [
                { x: new Date('2024-05-26T07:00:00.000Z'), y: 1129 },
                { x: new Date('2024-05-27T07:00:00.000Z'), y: 1145 },
                { x: new Date('2024-05-28T07:00:00.000Z'), y: 1440 },
                { x: new Date('2024-05-29T07:00:00.000Z'), y: 194 },
                { x: new Date('2024-05-31T07:00:00.000Z'), y: 197 },
                { x: new Date('2024-06-01T07:00:00.000Z'), y: 1440 },
                { x: new Date('2024-06-02T07:00:00.000Z'), y: 853 },
                { x: new Date('2024-06-03T07:00:00.000Z'), y: 445 },
                { x: new Date('2024-06-06T07:00:00.000Z'), y: 728 },
            ],
        },
        {
            coalescedBy: 'week',
            expected: [
                { x: new Date('2024-05-26T07:00:00.000Z'), y: 5545 },
                { x: new Date('2024-06-02T07:00:00.000Z'), y: 2026 },
            ],
        },
        {
            coalescedBy: 'month',
            expected: [
                { x: new Date('2024-05-01T07:00:00.000Z'), y: 4105 },
                { x: new Date('2024-06-01T07:00:00.000Z'), y: 3466 },
            ],
        },
    ])('properly aggregates when coalesced by $coalescedBy', ({ coalescedBy, expected }) => {
        const data = asSwitchData(taps, coalescedBy as ManipulateType);
        expect(data).toEqual(expected);
    });
});
