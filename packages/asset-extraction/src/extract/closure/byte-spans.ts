/* @layer shared-asset-extraction @kind logic */
/** rom_closure_battle.spans: a set of byte offsets -> sorted [start, end) runs. */
const byteSpans = (offsets: Iterable<number>): [number, number][] => {
  const out: [number, number][] = [];
  for (const o of [...offsets].sort((a, b) => a - b)) {
    const last = out[out.length - 1];
    if (last && o <= last[1]) last[1] = Math.max(last[1], o + 1);
    else out.push([o, o + 1]);
  }
  return out;
};

/** The `$BB:AAAA` label of a file offset (bank = 0xC0 + offset >> 16). */
const romLabel = (offset: number): string =>
  `$${(0xc0 + (offset >> 16)).toString(16).toUpperCase().padStart(2, '0')}:${(offset & 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;

export { byteSpans, romLabel };
