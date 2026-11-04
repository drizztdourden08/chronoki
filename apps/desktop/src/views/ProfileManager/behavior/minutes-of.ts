/* @layer renderer-components @kind logic */
const minutesOf = (ms: number): string => `${Math.max(1, Math.round(ms / 60000))} min`;

export { minutesOf };
