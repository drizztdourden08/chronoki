/* @layer bridge-wasm @kind logic */
import { AP_WORLD_VERSION } from './ap-game.constants';
import type { CtSlotData } from './ct-slot-data.type';
import type { CtSlotReading } from './ct-slot-reading.type';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parseCtSlotData = (raw: unknown): CtSlotReading => {
  if (!isRecord(raw)) return { kind: 'malformed' };
  const { worldVersion, seed, options, deathLink } = raw;
  if (typeof worldVersion !== 'string') return { kind: 'malformed' };
  if (worldVersion !== AP_WORLD_VERSION) {
    return { kind: 'version', message: `This room uses ChronoKi world ${worldVersion}; this app speaks ${AP_WORLD_VERSION}.` };
  }
  if (typeof seed !== 'string' || seed === '' || !isRecord(options)) return { kind: 'malformed' };
  return { kind: 'ok', data: { worldVersion, seed, options, deathLink: deathLink === true } };
};

export { parseCtSlotData };
