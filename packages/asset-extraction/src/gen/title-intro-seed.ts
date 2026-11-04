/* @layer shared-asset-extraction @kind logic */
import { hx } from './ctgen/text-file';

const TASKS = new Set([0x3749, 0x5bcf, 0x37fa, 0x5ffe, 0x5d32, 0x5b99, 0x5d01, 0x5c98, 0x5d71, 0x5d20, 0x5bbf, 0x5e1e, 0x34ab]);
const VBLS = new Set([0x388b, 0x380b, 0x3843, 0x5c57, 0x6212]);

const refuse = (msg: string): Error => new Error(`title_intro: REFUSING: ${msg}`);
const u16 = (b: Uint8Array, a: number): number => (b[a] as number) | ((b[a + 1] as number) << 8);

/** The seed-state checks: whitelisted task/vblank lists, frame counter, free palette jobs, quiet song watcher, full brightness. */
const checkSeed = (seed: Uint8Array): void => {
  for (let i = 0; i < 16; i += 1) {
    const t = u16(seed, 0x920 + i * 2);
    if (t && !TASKS.has(t)) throw refuse(`the seed's task list holds $${hx(t, 4)}, which the port does not model.`);
  }
  for (let i = 0; i < 8; i += 1) {
    const h = u16(seed, 0x940 + i * 2);
    if (h && !VBLS.has(h)) throw refuse(`the seed's vblank list holds $${hx(h, 4)}, which the port does not model.`);
  }
  if (u16(seed, 8) !== 1) {
    throw refuse(`the sequence's frame counter $7E:0008 is ${u16(seed, 8)} at the seed frame, not 1 -- the seed is not the sequence's own second NMI.`);
  }
  for (let r = 0; r < 12; r += 1) {
    if (seed[0x520 + r * 12]) throw refuse(`palette-job record ${r} is busy at the seed frame ($${hx(seed[0x520 + r * 12] as number, 2)}).`);
  }
  if (seed[0x389] !== seed[0x38a] || seed[0x388]) {
    throw refuse(
      `the song watcher is mid-flight at the seed frame ($0388=${hx(seed[0x388] as number, 2)} $0389=${hx(seed[0x389] as number, 2)} $038A=${hx(seed[0x38a] as number, 2)}); C3/09A4 would load a song on the port's first frame.`,
    );
  }
  if (seed[0x38d] !== 0x0f) {
    throw refuse(`the brightness shadow $7E:038D is $${hx(seed[0x38d] as number, 2)} at the seed frame, not $0F -- the capture is inside a fade.`);
  }
};

export { checkSeed };
