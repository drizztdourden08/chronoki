/* @layer bridge-wasm @kind logic */
// The levelling law, matching the engine's CtBattleLevelUp (core/belthasar/src/battle.c, "XP level-up and stat growth",
// C1/F623) for kind `id`, read from the ROM tables in the pack:
//   - on reaching level L: maxHP += gain of the first {breakpoint, gain} pair of CC/258A + id*8 with breakpoint >= L, clamp 999
//   - on reaching level L: maxMP += the same lookup in CC/25C2 + id*8, clamp 99
//   - core stat = base stat (+0x2F..+0x35) + CC/25FA[id*7 + rate] * (L - 1) / 100 (integer division), clamp 99
// Levelling down removes the gains of the levels passed. Current HP/MP are set to the new maximum. XP and NEXT are
// the caller's (the thresholds depend on the level only, so the slot's own values stay right).
import {
  GROW_ROW_BYTES, HP_GROW_ROM, MAX_HP, MAX_MP, MAX_STAT, MP_GROW_ROM, OFF_CUR_HP, OFF_CUR_MP, OFF_LEVEL, OFF_MAX_HP, OFF_MAX_MP,
  STAT_GROWTH, STAT_RATE_ROM, STAT_RATE_ROW_BYTES,
} from './level-record.constants';

type RomReader = (addr: number) => number | undefined;

const pairGain = (rom: RomReader, table: number, kind: number, level: number): number | null => {
  for (let k = 0; k < GROW_ROW_BYTES; k += 2) {
    const breakpoint = rom(table + kind * GROW_ROW_BYTES + k);
    const gain = rom(table + kind * GROW_ROW_BYTES + k + 1);
    if (breakpoint === undefined || gain === undefined) return null;
    if (breakpoint >= level) return gain;
  }
  return 0;
};

const gainsBetween = (rom: RomReader, table: number, kind: number, from: number, to: number): number | null => {
  const [lo, hi] = from < to ? [from, to] : [to, from];
  let sum = 0;
  for (let level = lo + 1; level <= hi; level += 1) {
    const g = pairGain(rom, table, kind, level);
    if (g === null) return null;
    sum += g;
  }
  return from < to ? sum : -sum;
};

const u16 = (r: Uint8Array, at: number): number => (r[at] ?? 0) | ((r[at + 1] ?? 0) << 8);

const put16 = (r: Uint8Array, at: number, v: number): void => {
  r[at] = v & 0xff;
  r[at + 1] = (v >> 8) & 0xff;
};

const levelRecord = (record: Uint8Array, kind: number, level: number, rom: RomReader): Uint8Array | null => {
  const out = record.slice();
  const from = record[OFF_LEVEL] ?? 1;
  const hp = gainsBetween(rom, HP_GROW_ROM, kind, from, level);
  const mp = gainsBetween(rom, MP_GROW_ROM, kind, from, level);
  if (hp === null || mp === null) return null;
  const maxHp = Math.max(1, Math.min(MAX_HP, u16(record, OFF_MAX_HP) + hp));
  const maxMp = Math.max(0, Math.min(MAX_MP, u16(record, OFF_MAX_MP) + mp));
  for (const stat of STAT_GROWTH) {
    const rate = rom(STAT_RATE_ROM + kind * STAT_RATE_ROW_BYTES + stat.rate);
    if (rate === undefined) return null;
    out[stat.current] = Math.min(MAX_STAT, (record[stat.base] ?? 0) + Math.floor((rate * (level - 1)) / 100));
  }
  out[OFF_LEVEL] = level;
  put16(out, OFF_MAX_HP, maxHp);
  put16(out, OFF_CUR_HP, maxHp);
  put16(out, OFF_MAX_MP, maxMp);
  put16(out, OFF_CUR_MP, maxMp);
  return out;
};

export type { RomReader };
export { levelRecord };
