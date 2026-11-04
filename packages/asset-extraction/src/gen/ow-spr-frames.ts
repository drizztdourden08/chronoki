/* @layer shared-asset-extraction @kind logic */
const sprFrames = (data: Uint8Array): Uint8Array[] => {
  const out: Uint8Array[] = [];
  let o = 1;
  for (let i = 0; i < (data[0] as number); i += 1) {
    const size = (data[o + 3] as number) * (data[o + 4] as number) * 4;
    out.push(data.slice(o + 7, o + 7 + size));
    o += 7 + size;
  }
  if (o !== data.length) throw new Error(`ow_sprites: a malformed .spr (${o} of ${data.length} bytes)`);
  return out;
};

export { sprFrames };
