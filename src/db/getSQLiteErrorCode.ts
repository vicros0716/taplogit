export function getSQLiteErrorCode(error: unknown) {
    // Unclear why there's a mysterious extra character before the colon, but the regex fails without it.
    const SQLiteErrorRegex = /Caused by: Error code .: ([\w\s]+)/;
    if (error instanceof Error) {
        const matches = SQLiteErrorRegex.exec(error.message);
        return matches === null ? `Unknown error; no Error code found in ${error.message}` : matches[1];
    }
    return `Unknown error; not an instance of Error`;
}
