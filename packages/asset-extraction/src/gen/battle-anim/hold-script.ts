/* @layer shared-asset-extraction @kind logic */
const holdScript = (F: number, K = 8): string => (F <= K ? `100:${F}` : `100:${K},0:${F - K}`);

export { holdScript };
