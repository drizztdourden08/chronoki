/* @layer shared-asset-extraction @kind logic */

const sprFrames = (data: Uint8Array): { head: Uint8Array; px: Uint8Array }[] => {
  const out: { head: Uint8Array; px: Uint8Array }[] = [];
  let o = 1;
  for (let i = 0; i < (data[0] as number); i += 1) {
    const n = (data[o + 3] as number) * (data[o + 4] as number) * 4;
    out.push({ head: data.slice(o, o + 7), px: data.slice(o + 7, o + 7 + n) });
    o += 7 + n;
  }
  if (o !== data.length) throw new Error(`ow_sprites: a malformed .spr (${o} of ${data.length} bytes)`);
  return out;
};

export { sprFrames };
