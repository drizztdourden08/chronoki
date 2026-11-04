/* @layer shared-asset-extraction @kind logic */
/** The 4bpp planar pixel (x, y) of the 8x8 tile at file offset `off` (planes 0/1 in the first 16 bytes, 2/3 after). */
const tilePixel4 = (rom: Uint8Array, off: number, x: number, y: number): number => {
  const bit = 7 - x;
  return (
    ((rom[off + y * 2]! >> bit) & 1) |
    (((rom[off + y * 2 + 1]! >> bit) & 1) << 1) |
    (((rom[off + 16 + y * 2]! >> bit) & 1) << 2) |
    (((rom[off + 16 + y * 2 + 1]! >> bit) & 1) << 3)
  );
};

export { tilePixel4 };
