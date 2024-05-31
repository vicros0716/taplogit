export function assert<T>(value: T, errorMessage?: string): asserts value {
    if (!value) {
        throw new Error(errorMessage ?? `${value} was falsy.`);
    }
}

export function assertedNonNull<T>(value: T, errorMessage?: string): NonNullable<T> {
    assert(value, errorMessage);
    return value;
}
