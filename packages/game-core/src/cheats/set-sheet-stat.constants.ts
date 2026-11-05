/* @layer bridge-wasm @kind constants */
import { SHEET_HP, SHEET_MAX_HP, SHEET_MAX_MP, SHEET_MP } from '../game-info/wram-map.constants';

type SheetStat = 'hp' | 'mp' | 'maxHp' | 'maxMp';

const STAT_OFFSETS: Readonly<Record<SheetStat, number>> = { hp: SHEET_HP, mp: SHEET_MP, maxHp: SHEET_MAX_HP, maxMp: SHEET_MAX_MP };
const STAT_CAPS: Readonly<Record<SheetStat, number>> = { hp: 999, mp: 99, maxHp: 999, maxMp: 99 };

export { STAT_CAPS, STAT_OFFSETS };
export type { SheetStat };
