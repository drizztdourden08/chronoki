/* @layer shared-asset-extraction @kind logic */
import { dec, hexN } from './shared/py-format';
import type { Sprite } from './shared/oam-decode';
import { NTILE, HEAD, KF_HEAD, SCHED_HEAD, SCHED } from './battle-settle-emit.constants';
import type { SettleKf } from './battle-settle-emit.type';

const objLine = (s: Sprite): string =>
  `  { ${dec(s.idx, 3)}, ${dec(s.x, 4)}, ${dec(s.y, 3)}, 0x${hexN(s.tile, 3)}, ${s.pal}, ${s.prio}, ${s.hflip}, ${s.vflip} },`;

const stepLines = (kfs: SettleKf[], pc: number, tag: string): string[] => {
  const want = pc === 0 ? 5 : 6;
  const steps = kfs
    .map((kf, i): [number, number] => [SCHED[kf.name] as number, i])
    .filter(([, i]) => (kfs[i] as SettleKf).pal === want)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cap = tag.charAt(0) + tag.slice(1).toLowerCase();
  return [
    `#define CT_SETTLE_${tag}_NSTEP ${steps.length}`,
    `static const CtSettleStep ctBattleSettle${cap}[CT_SETTLE_${tag}_NSTEP] = {`,
    ...steps.map(([sv, ki]) => `  { ${sv}, ${ki} },`),
    '};',
  ];
};

const emitSettle = (kfs: SettleKf[], objFlat: Sprite[]): string => {
  const kfLines = kfs.map((kf, i) => {
    const pc = kf.pal === 5 ? 0 : 1;
    return `  { "${kf.name}", ${pc}, ${kf.pal}, ${kf.objOff}, ${kf.nObj}, ${i}, ${dec(kf.ax, 4)}, ${dec(kf.ay, 3)}, ${kf.n} },`;
  });
  const tileLines = kfs.flatMap((kf, i) => [
    `  { // kf${i} ${kf.name} (N${kf.n} pal${kf.pal})`,
    ...kf.tiles.map((t) => `    {${Array.from(t, (b) => `0x${hexN(b, 2)}`).join(',')}},`),
    '  },',
  ]);
  const lines = [
    ...HEAD,
    `#define CT_SETTLE_NOBJ ${objFlat.length}`,
    'static const CtSettleObj ctBattleSettleObj[CT_SETTLE_NOBJ] = {',
    ...objFlat.map(objLine),
    '};\n',
    ...KF_HEAD,
    `#define CT_SETTLE_NKF ${kfs.length}`,
    'static const CtSettleKeyframe ctBattleSettleKf[CT_SETTLE_NKF] = {',
    ...kfLines,
    '};\n',
    `// Per-keyframe OBJ 8x8 tiles 0x00..0x${hexN(NTILE - 1, 2)} (4bpp planar, 32 B) -- streamed per pose.`,
    '// 16x16 sprite of tile T uses 8x8 tiles T, T+1, T+0x10, T+0x11.',
    `#define CT_SETTLE_NTILE 0x${hexN(NTILE, 2)}`,
    'static const uint8_t ctBattleSettleTiles[CT_SETTLE_NKF][CT_SETTLE_NTILE][32] = {',
    ...tileLines,
    '};\n',
    ...SCHED_HEAD,
    ...stepLines(kfs, 0, 'CRONO'),
    ...stepLines(kfs, 1, 'MARLE'),
    '#define CT_SETTLE_CRONO_ENDV 64   // >= this victoryHold -> held battle_end kf0',
    '#define CT_SETTLE_MARLE_ENDV 68   // >= this victoryHold -> held battle_end kf1',
    '#endif // CT_BATTLE_SETTLE_H',
  ];
  return `${lines.join('\n')}\n`;
};
export { emitSettle };
