/* @layer renderer-lib @kind logic */
import type { PackTables, PendulumGeometry, PendulumTexture } from './title-pendulum.type';
import { M7_TILE_BYTES, PALETTE_COLOURS, PENDULUM_DEFINES, PENDULUM_TABLES } from './title-pendulum.constants';

const geometryOf = (defines: ReadonlyMap<string, number>): PendulumGeometry | null => {
  const value = (name: string): number => defines.get(name) ?? Number.NaN;
  const geometry: PendulumGeometry = {
    tiles: value(PENDULUM_DEFINES.tiles),
    row0: value(PENDULUM_DEFINES.row0),
    col0: value(PENDULUM_DEFINES.col0),
    cols: value(PENDULUM_DEFINES.cols),
    rows: value(PENDULUM_DEFINES.rows),
    pivotX: value(PENDULUM_DEFINES.pivotX),
    pivotY: value(PENDULUM_DEFINES.pivotY),
  };
  return Object.values(geometry).every(Number.isFinite) && geometry.cols > 0 && geometry.rows > 0 ? geometry : null;
};

const paletteOf = (bytes: Uint8Array): number[] =>
  Array.from({ length: PALETTE_COLOURS }, (_, index) => (bytes[index * 2] ?? 0) | ((bytes[index * 2 + 1] ?? 0) << 8));

const pendulumTexture = (pack: PackTables): PendulumTexture | null => {
  const geometry = geometryOf(pack.defines);
  const chr = pack.tables.get(PENDULUM_TABLES.chr);
  const map = pack.tables.get(PENDULUM_TABLES.map);
  const palette = pack.tables.get(PENDULUM_TABLES.palette);
  if (!geometry || !chr || !map || !palette) return null;
  if (chr.length < geometry.tiles * M7_TILE_BYTES || map.length !== geometry.cols * geometry.rows) return null;
  if (palette.length !== PALETTE_COLOURS * 2) return null;
  return { geometry, chr, map, palette: paletteOf(palette) };
};

export { pendulumTexture };
