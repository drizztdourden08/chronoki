/* @layer bridge-wasm @kind fixture */
import { CONTROL_COUNT, CONTROL_TABLE } from '../tech-order/tech-order.constants';
import { GROUP_SIZE, GROUP_TABLE_ROM } from './element-rando.constants';

const GROUPS: readonly (readonly number[])[] = [
  [0], [1], [2], [3], [4], [5], [6], [1, 0], [0, 2], [3, 0],
];

const TECHS: readonly (readonly [group: number, element: number])[] = [
  [0, 0x82], [1, 0x22], [2, 0x12], [4, 0x22], [6, 0x82], [6, 0x42], [3, 0x42], [3, 0x12], [3, 0x82], [5, 0x04],
  [7, 0x22], [8, 0x42], [9, 0x42], [6, 0x00],
];

const le32 = (v: number): number[] => [v & 0xff, (v >> 8) & 0xff, (v >> 16) & 0xff, (v >>> 24) & 0xff];

const controlBytes = (): number[] => {
  const bytes = new Array<number>(CONTROL_COUNT * CONTROL_TABLE.size).fill(0);
  TECHS.forEach(([group, element], i) => {
    bytes[(i + 1) * CONTROL_TABLE.size] = group;
    bytes[(i + 1) * CONTROL_TABLE.size + 3] = element;
  });
  return bytes;
};

const groupBytes = (): number[] => GROUPS.flatMap((members) => Array.from({ length: GROUP_SIZE }, (_, k) => members[k] ?? 0xff));

const syntheticElementPack = (withGroups = true): Uint8Array => {
  const entries = [{ id: CONTROL_TABLE.rom, data: controlBytes() }, ...(withGroups ? [{ id: GROUP_TABLE_ROM, data: groupBytes() }] : [])];
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(entries.length)];
  let at = 12 + entries.length * 16;
  entries.forEach((e) => {
    bytes.push(...le32(37), ...le32(e.id), ...le32(at), ...le32(e.data.length));
    at += e.data.length;
  });
  entries.forEach((e) => bytes.push(...e.data));
  return Uint8Array.from(bytes);
};

export { syntheticElementPack };
