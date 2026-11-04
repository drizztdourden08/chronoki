/* @layer renderer-lib @kind logic */
const stemOf = (fileName: string): string => (fileName.split(/[\\/]/).pop() ?? fileName).replace(/(-\d+)?\.[^.]*$/, '');

export { stemOf };
