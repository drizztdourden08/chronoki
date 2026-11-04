/* @layer shared-asset-extraction @kind logic */
import type { RomTable } from './closure.type';
import { CC } from './battle-misc.constants';
import { byteAt } from '../bytes/byte-reader';

const smallTables = (rom: Uint8Array): RomTable[] => {
  const out: RomTable[] = [];
  const t = (name: string, a: number, n: number): void => void out.push([name, a, a + n]);
  t('tech list bases and record offsets ($CC:F38C, $CC:F395)', CC + 0xf38c, 9 + 6);
  t('pose row layouts ($CC:F3B6, 14 x 6)', CC + 0xf3b6, 14 * 6);
  t('PC walk tables ($CC:F414-F693, 32 tracks)', CC + 0xf414, 0xf694 - 0xf414);
  t('arena offsets ($CC:F544, 8-bit)', CC + 0xf544, 256);
  t('status icon periods ($CC:F5FD, 8-bit)', CC + 0xf5fd, 256);
  t('bracket OAM ($CC:F604, 4 x 4)', CC + 0xf604, 16);
  t('weapon ranged ($CC:F63C, char)', CC + 0xf63c, 256);
  t('status icons ($CC:F6D4, 8-bit + 3 x 4)', CC + 0xf6d4, 256 + 16);
  t('status ramp bases ($CC:F754, word)', CC + 0xf754, 257);
  let a = CC + 0xf77f;
  while ((byteAt(rom, a) & 0x80) === 0) a += 4;
  t('status scan ($CC:F77F, 4-byte records to bit 7)', CC + 0xf77f, a + 1 - (CC + 0xf77f));
  t('effect frame bases and grid ($CC:F7C0, $CC:F820)', CC + 0xf7c0, 0x60 + 0x10);
  t('OAM templates ($CC:F84D)', CC + 0xf84d, 2 * 0x17 + 2 * 44);
  t('battle setup ($CC:F903, 8-bit)', CC + 0xf903, 256);
  t('pose destinations and uploads ($CC:F941-F977)', CC + 0xf941, 0xf977 - 0xf941);
  t('OAM name / attribute pairs ($CC:FAF3)', CC + 0xfaf3, 0xb0);
  t('pose classes, squares, move classes, co-actors, dwells ($CC:FB6F-FCCD)', CC + 0xfb6f, 0xfbce - 0xfb6f + 256);
  t('sheet offsets ($CC:FC1E, y)', CC + 0xfc1e, 2 * 256);
  t('enemy palette OBJ tail ($FF:9E0A, 3 words)', 0x3f9e0a, 6);
  return out;
};

export { smallTables };
