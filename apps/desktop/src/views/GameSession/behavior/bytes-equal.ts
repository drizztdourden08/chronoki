/* @layer renderer-appshell @kind logic */
const bytesEqual = (a: Uint8Array | null, b: Uint8Array | null): boolean =>
  a === null || b === null ? a === b : a.length === b.length && a.every((value, i) => value === b[i]);

export { bytesEqual };
