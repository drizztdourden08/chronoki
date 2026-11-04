/* @layer shared-asset-extraction @kind constants */
const ENEMY_TILES = [
  0x60, 0x61, 0x70, 0x71, 0x62, 0x63, 0x72, 0x73, 0x64, 0x65, 0x74, 0x75, 0x66, 0x67, 0x76, 0x77,
];

const TILE_ORIGIN: Record<number, [number, number]> = {
  0x60: [0, 0], 0x61: [8, 0], 0x70: [0, 8], 0x71: [8, 8],
  0x62: [16, 0], 0x63: [24, 0], 0x72: [16, 8], 0x73: [24, 8],
  0x64: [0, 16], 0x65: [8, 16], 0x74: [0, 24], 0x75: [8, 24],
  0x66: [16, 16], 0x67: [24, 16], 0x76: [16, 24], 0x77: [24, 24],
};

const KEY_ORDER: number[] = ENEMY_TILES.flatMap((t) => {
  const [ox, oy] = TILE_ORIGIN[t] as [number, number];
  const keys: number[] = [];
  for (let y = 0; y < 8; y += 1) for (let x = 0; x < 8; x += 1) keys.push((oy + y) * 32 + ox + x);
  return keys;
});

export { ENEMY_TILES, TILE_ORIGIN, KEY_ORDER };
