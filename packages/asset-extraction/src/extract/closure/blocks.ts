/* @layer shared-asset-extraction @kind logic */

const blocks = (offsets: Iterable<number>): [number, number][] => {
  const srt = [...new Set(offsets)].sort((x, y) => x - y);
  return srt.map((o, i) => {
    const bankEnd = Math.floor(o / 0x10000) * 0x10000 + 0x10000;
    const next = srt[i + 1];
    return [o, next !== undefined && next < bankEnd ? next : bankEnd];
  });
};

export { blocks };
