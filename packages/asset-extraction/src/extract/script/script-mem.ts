/* @layer shared-asset-extraction @kind logic */
/** The scene-script WRAM: global $7F0000, local $7F0200 (cleared per scene), system $7E0000. */
interface ScriptMem {
  g: Uint8Array;
  l: Uint8Array;
  s: Uint8Array;
  r8: (a: number) => number;
  w8: (a: number, v: number) => void;
  r16: (a: number) => number;
  w16: (a: number, v: number) => void;
}

const LOC = 0x7f0200;
const GLB = 0x7f0000;
/** $7E2980-82 in the static resolve (src/ct_vm.c memBoot). */
const PARTY = [0x00, 0x80, 0x80];

/** script.Mem: seeded as the game start (CTViewer main.rs) and the engine's memBoot. */
const createScriptMem = (): ScriptMem => {
  const g = new Uint8Array(0x200);
  const l = new Uint8Array(0x200);
  const s = new Uint8Array(0x10000);
  for (const [a, b] of [[0x0104, 192], [0x1ba7, 14], [0x1baa, 4], [0x1bab, 1], [0x1ba8, 16]] as const) s[a] = (s[a] as number) | b;
  for (const a of [0x0197, 0x0199, 0x019b]) s[a] = 0x80;
  [...PARTY, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80].forEach((v, k) => {
    s[0x2980 + k] = v;
  });
  const r8 = (a: number): number => {
    if (a >= 0x7e0000 && a < 0x7f0000) return s[a - 0x7e0000] as number;
    if (a >= 0x7f0000 && a < 0x7f0200) return g[a - 0x7f0000] as number;
    if (a >= 0x7f0200 && a < 0x7f0400) return l[a - 0x7f0200] as number;
    return 0;
  };
  const w8 = (a: number, v: number): void => {
    const x = v & 0xff;
    if (a >= 0x7e0000 && a < 0x7f0000) s[a - 0x7e0000] = x;
    else if (a >= 0x7f0000 && a < 0x7f0200) g[a - 0x7f0000] = x;
    else if (a >= 0x7f0200 && a < 0x7f0400) l[a - 0x7f0200] = x;
  };
  return {
    g,
    l,
    s,
    r8,
    w8,
    r16: (a) => r8(a) | (r8(a + 1) << 8),
    w16: (a, v) => {
      w8(a, v & 0xff);
      w8(a + 1, (v >> 8) & 0xff);
    },
  };
};

export { createScriptMem, GLB, LOC, PARTY };
export type { ScriptMem };
