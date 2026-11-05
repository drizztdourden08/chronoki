/* @layer bridge-wasm @kind logic */
import {
  CONTROL_COUNT, CONTROL_EFFECT_BYTES, CONTROL_FIXED_BYTE, CONTROL_TABLE, EFFECT_REF_FLAG, EFFECT_REF_MASK, FIRST_TECH_ID,
  LAST_TECH_ID, MOVED_TABLES,
} from './tech-order.constants';
import type { TechIdMaps } from './tech-id-maps-of.type';
import type { RecordTable, RomSpace, RomStage } from './tech-order.type';

const techIds = Array.from({ length: LAST_TECH_ID }, (_, i) => FIRST_TECH_ID + i);

const remapEffectRef = (maps: TechIdMaps, byte: number): number =>
  (byte & EFFECT_REF_FLAG) | maps.newIdOf(byte & EFFECT_REF_MASK);

const moveRecords = (space: RomSpace, stage: RomStage, maps: TechIdMaps, table: RecordTable): string[] =>
  techIds.flatMap((id) => {
    const from = maps.oldIdOf(id);
    return Array.from({ length: table.size }, (_, b) => {
      const value = space.read(table.rom + from * table.size + b);
      if (value === undefined) return `tech-order: table ${table.rom.toString(16)} record ${from} is not in the pack`;
      stage.put(table.rom + id * table.size + b, value, `tech-order: tech ${from} to ${id}`);
      return '';
    }).filter((message) => message !== '');
  });

const moveControls = (space: RomSpace, stage: RomStage, maps: TechIdMaps): string[] => {
  const { rom, size } = CONTROL_TABLE;
  return Array.from({ length: CONTROL_COUNT }, (_, k) => k).flatMap((k) =>
    Array.from({ length: size }, (_, b) => {
      const from = b === CONTROL_FIXED_BYTE ? k : maps.oldIdOf(k);
      const value = space.read(rom + from * size + b);
      if (value === undefined) return `tech-order: control ${from} is not in the pack`;
      stage.put(rom + k * size + b, CONTROL_EFFECT_BYTES.includes(b) ? remapEffectRef(maps, value) : value, `tech-order: control ${k}`);
      return '';
    }).filter((message) => message !== ''));
};

const planTechRecordMoves = (space: RomSpace, stage: RomStage, maps: TechIdMaps): string[] => [
  ...MOVED_TABLES.flatMap((table) => moveRecords(space, stage, maps, table)),
  ...moveControls(space, stage, maps),
];

export { planTechRecordMoves };
