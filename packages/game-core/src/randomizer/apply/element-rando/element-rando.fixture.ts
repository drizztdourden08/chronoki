/* @layer bridge-wasm @kind fixture */
import { CONTROL_COUNT, CONTROL_TABLE } from '../tech-order/tech-order.constants';
import { GROUP_SIZE, GROUP_TABLE_ROM } from './element-rando.constants';
import { GROUPS, TECHS } from './element-rando.fixture.constants';

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
