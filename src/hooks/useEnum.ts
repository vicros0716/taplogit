import { useState } from 'react';

export function useEnum<T>(values: readonly T[], defaultValue?: T) {
    const [index, setIndex] = useState(defaultValue ? values.indexOf(defaultValue) : 0);
    return [
        values[index],
        () => {
            setIndex((index + 1) % values.length);
        },
        () => {
            setIndex((index + values.length - 1) % values.length);
        },
    ] as const;
}
