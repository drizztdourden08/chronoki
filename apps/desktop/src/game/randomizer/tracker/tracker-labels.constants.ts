/* @layer bridge-wasm @kind constants */
const CHECK_ID_PATTERN = /^(chest|gift)-([0-9a-f]{3})-o?(\w+)$/;
const KIND_LABELS: Readonly<Record<string, string>> = { chest: 'Chest', gift: 'Gift' };
const MAP_RADIX = 16;

export { CHECK_ID_PATTERN, KIND_LABELS, MAP_RADIX };
