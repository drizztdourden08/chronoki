/* @layer shared-asset-extraction @kind logic @source Python rom_closure_battle.spans */

const byteSpans = (offsets: Iterable<number>): [number, number][] => {
  const out: [number, number][] = [];
  for (const o of [...offsets].sort((a, b) => a - b)) {
    const last = out[out.length - 1];
    if (last && o <= last[1]) last[1] = Math.max(last[1], o + 1);
    else out.push([o, o + 1]);
  }
  return out;
};

export { byteSpans };
