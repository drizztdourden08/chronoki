/* @layer shared-asset-extraction @kind logic */
/** One decoded OAM entry (ctlib/oam.py decode). */
interface Sprite {
  idx: number;
  x: number;
  y: number;
  tile: number;
  attr: number;
  prio: number;
  pal: number;
  size: number;
  vflip: number;
  hflip: number;
  onscreen: boolean;
}

const OAM_SIZE = 544;

/** ctlib/oam.load: the 544-byte blob (512 low table + 32 high table) from a ct.exe --peek .oam sidecar (1056 or 1568 bytes) or a 544-byte blob. */
const oamBlob = (sidecar: Uint8Array): Uint8Array => {
  if (sidecar.length === OAM_SIZE) return sidecar;
  if (sidecar.length !== 1056 && sidecar.length !== 1568) {
    throw new Error(`not a 544/1056/1568-byte .oam sidecar (${sidecar.length} bytes)`);
  }
  const out = new Uint8Array(OAM_SIZE);
  out.set(sidecar.subarray(0, 512), 0);
  out.set(sidecar.subarray(1024, 1056), 512);
  return out;
};

/** ctlib/oam.load_cgram: the 512-byte CGRAM of a 1568-byte sidecar, else null. */
const oamCgram = (sidecar: Uint8Array): Uint8Array | null =>
  sidecar.length === 1568 ? sidecar.slice(1056, 1568) : null;

/** ctlib/oam.decode: 128 sprites from the 544-byte blob. */
const decodeOam = (data: Uint8Array): Sprite[] => {
  if (data.length < OAM_SIZE) throw new Error(`OAM blob must be ${OAM_SIZE} bytes, got ${data.length}`);
  const sprites: Sprite[] = [];
  for (let i = 0; i < 128; i += 1) {
    const x = data[i * 4] as number;
    const y = data[i * 4 + 1] as number;
    const tile = data[i * 4 + 2] as number;
    const attr = data[i * 4 + 3] as number;
    const hb = data[512 + (i >> 2)] as number;
    const shift = (i % 4) * 2;
    let sx = x | (((hb >> shift) & 1) << 8);
    if (sx >= 256) sx -= 512;
    sprites.push({
      idx: i,
      x: sx,
      y,
      tile: tile | ((attr & 1) << 8),
      attr,
      prio: (attr >> 4) & 3,
      pal: (attr >> 1) & 7,
      size: (hb >> (shift + 1)) & 1,
      vflip: (attr >> 7) & 1,
      hflip: (attr >> 6) & 1,
      onscreen: sx >= 0 && sx < 256 && y < 224,
    });
  }
  return sprites;
};

export type { Sprite };
export { decodeOam, oamBlob, oamCgram };
