/* @layer shared-asset-extraction @kind logic @source Python gfx.decode_tiles */
const decodeTiles = (data: Uint8Array, bpp: number): Uint8Array[] => {
  const tileBytes = 8 * bpp;
  const tiles: Uint8Array[] = [];
  const count = Math.floor(data.length / tileBytes);
  for (let t = 0; t < count; t += 1) {
    const base = t * tileBytes;
    const px = new Uint8Array(64);
    for (let y = 0; y < 8; y += 1) {
      const planes: [number, number][] = [];
      for (let pair = 0; pair < bpp / 2; pair += 1) {
        planes.push([data[base + pair * 16 + y * 2]!, 2 * pair]);
        planes.push([data[base + pair * 16 + y * 2 + 1]!, 2 * pair + 1]);
      }
      for (let x = 0; x < 8; x += 1) {
        const bit = 7 - x;
        let v = 0;
        for (const [b, shift] of planes) v |= ((b >> bit) & 1) << shift;
        px[y * 8 + x] = v;
      }
    }
    tiles.push(px);
  }
  return tiles;
};

export { decodeTiles };
