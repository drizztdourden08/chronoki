/* @layer shared-asset-extraction @kind logic */
import { byteAt, wordAt } from '../bytes/byte-reader';
import type { RomTable } from './closure.type';

const C1 = 0x010000;
const C2 = 0x020000;
const CC = 0x0c0000;
const FD = 0x3d0000;
const E1 = 0x210000;

const hex2 = (v: number): string => v.toString(16).toUpperCase().padStart(2, '0');

/** rom_closure_battle.ai_section_end: C1/AFE6's walk of one section of an AI script ($CC + p): [conditions .. FE][actions .. FE] blocks until FF. */
const aiSectionEnd = (rom: Uint8Array, start: number): number => {
  let p = start;
  while (byteAt(rom, CC + p) !== 0xff) {
    while (byteAt(rom, CC + p) !== 0xfe) p += 1;
    p += 1;
    while (byteAt(rom, CC + p) !== 0xfe) p += 1;
    p += 1;
  }
  return p + 1;
};

/** rom_closure_battle.record_tables: the enemies', PCs', techs', items' and areas' records and the small tables, by the reading code's index ranges. */
const recordTables = (rom: Uint8Array): RomTable[] => {
  const out: RomTable[] = [];
  const t = (name: string, a: number, n: number): void => void out.push([name, a, a + n]);
  t('enemy stats ($CC:4700, 23 x 256)', CC + 0x4700, 23 * 256);
  t('enemy names ($CC:6500, 11 x 256)', CC + 0x6500, 11 * 256);
  t('enemy rewards ($CC:5E00, 7 x 256)', CC + 0x5e00, 7 * 256);
  t('enemy AI pointers ($CC:8B08)', CC + 0x8b08, 2 * 256);
  for (let i = 0; i < 256; i += 1) {
    const p = wordAt(rom, CC + 0x8b08 + 2 * i);
    out.push([`enemy AI script ${hex2(i)}`, CC + p, CC + aiSectionEnd(rom, aiSectionEnd(rom, p)) + 4]);
  }
  t('enemy action records ($CC:88CA, 11 x 256)', CC + 0x88ca, 11 * 256);
  t('enemy attack records ($CC:89C6, 12 x 256)', CC + 0x89c6, 12 * 256);
  t('class-2 action records ($CC:6FCA, 11 x 256)', CC + 0x6fca, 11 * 256);
  t('class-2 attack records ($CC:7AC9, 12 x 256)', CC + 0x7ac9, 12 * 256);
  t('enemy action groups and areas ($CC:86C9, act * 2)', CC + 0x86c9, 2 * 256 + 1);
  t('field enemy records ($E4:F600, 10 x 256)', 0x24f600, 10 * 256);
  t('enemy palettes ($E4:0000, 24 x 256)', 0x240000, 24 * 256);
  t('enemy keys ($E1:DE80, id)', E1 + 0xde80, 256);
  t('PC action selectors ($CC:2583, char)', CC + 0x2583, 256);
  t('PC action / tech records ($CC:1BEB, 11 x 256)', CC + 0x1beb, 11 * 256);
  t('PC attack records ($CC:213F, 12 x 256)', CC + 0x213f, 12 * 256);
  t('tech groups ($CC:249F, 3 x 128)', CC + 0x249f, 3 * 128);
  t('tech MP ($CC:253B, & 7F)', CC + 0x253b, 128);
  t('tech targets and areas ($CC:1ACB, 2 x 75)', CC + 0x1acb, 2 * 0x75);
  t('tech element nibbles ($CC:2BDC, $CC:2BEB, the tech id)', CC + 0x2bdc, 0x0f + 256);
  t('XP to next ($CC:2632, 100 levels)', CC + 0x2632, 2 * 100);
  t('HP / MP growth ($CC:258A, $CC:25C2, 8 x 8)', CC + 0x258a, 0x25c2 - 0x258a + 64);
  t('stat rates ($CC:25FA, 7 x 8)', CC + 0x25fa, 7 * 8);
  t('tech TP ($CC:26FA, 16 x 8)', CC + 0x26fa, 16 * 8);
  t('tech learn ranges ($CC:276A, (id << 1) & FF)', CC + 0x276a, 256);
  t('ATB reload ($CC:2E31, 8 x 16)', CC + 0x2e31, 8 * 16);
  t('item battle records ($CC:0ABC, 3 x 68)', CC + 0x0abc, 3 * 0x44);
  t('item amounts ($CC:05CC, 4 x 68)', CC + 0x05cc, 4 * 0x44);
  t('item target groups ($CC:1BB5, 68)', CC + 0x1bb5, 0x44);
  t('equipment and the stats header ($CC:0000, the $2600 copy)', CC, 0x230);
  t('tech ranges ($C2:BD40, char + 1)', C2 + 0xbd40, 9);
  t('area pointers ($CC:2AB0, 8-bit area)', CC + 0x2ab0, 2 * 256);
  for (let i = 0; i < 256; i += 1) {
    const r = wordAt(rom, CC + 0x2ab0 + 2 * i);
    out.push([`area record ${hex2(i)}`, CC + r, CC + r + 1 + 3 * byteAt(rom, CC + r)]);
  }
  t('battle RNG ($FD:BA61, 8-bit)', FD + 0xba61, 256);
  t('AI action lengths ($FD:BA4A, the op)', FD + 0xba4a, 256);
  t('combatant blocks ($FD:A80B, 11 seats)', FD + 0xa80b, 2 * 11);
  t('command records ($FD:A849, 11 seats)', FD + 0xa849, 2 * 11);
  t('tech singles ($FD:A89D, char + 1)', FD + 0xa89d, 9);
  t('seat row pointers ($FD:B957, $29AC * 2)', FD + 0xb957, 2 * 256);
  for (let i = 0; i < 256; i += 1) {
    const p = wordAt(rom, FD + 0xb957 + 2 * i);
    out.push([`seat rows ${hex2(i)}`, FD + p, FD + p + 0x15]);
  }
  t('AI target resolvers ($C1:B8BB, 24 words)', C1 + 0xb8bb, 48);
  t('timer flag bases ($C1:B947, 13 words)', C1 + 0xb947, 26);
  return out;
};

export { recordTables };
