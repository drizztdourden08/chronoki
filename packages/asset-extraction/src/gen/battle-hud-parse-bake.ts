/* @layer shared-asset-extraction @kind logic */
const parseBake = (text: string, name: string): number[][] => {
  const i = text.indexOf(`${name}[48][256] = {`);
  if (i < 0) throw new Error(`${name}[48][256] is not in the header`);
  const j = text.indexOf('};', i);
  const nums = (text.slice(text.indexOf('{', i) + 1, j).match(/\d+/g) ?? []).map(Number);
  if (nums.length !== 48 * 256) throw new Error(`${name}: ${nums.length} numbers, not ${48 * 256}`);
  return Array.from({ length: 48 }, (_, k) => nums.slice(k * 256, (k + 1) * 256));
};

export { parseBake };
