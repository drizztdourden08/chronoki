/* @layer renderer-lib @kind types */
interface PackEntry {
  type: number;
  at: number;
  length: number;
}

interface PackTables {
  tables: ReadonlyMap<string, Uint8Array>;
  defines: ReadonlyMap<string, number>;
}

interface PendulumGeometry {
  tiles: number;
  row0: number;
  col0: number;
  cols: number;
  rows: number;
  pivotX: number;
  pivotY: number;
}

interface PendulumTexture {
  geometry: PendulumGeometry;
  chr: Uint8Array;
  map: Uint8Array;
  palette: readonly number[];
}

interface PendulumImage {
  width: number;
  height: number;
  rgba: Uint8ClampedArray<ArrayBuffer>;
}

interface TitlePendulumArt {
  png: Uint8Array;
  width: number;
  height: number;
}

export type { PackEntry, PackTables, PendulumGeometry, PendulumImage, PendulumTexture, TitlePendulumArt };
