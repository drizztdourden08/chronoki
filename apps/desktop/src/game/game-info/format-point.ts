/* @layer bridge-wasm @kind logic */
const formatPoint = (x: number | null, y: number | null): string => (x === null || y === null ? 'Unknown' : `${x}, ${y}`);

export { formatPoint };
