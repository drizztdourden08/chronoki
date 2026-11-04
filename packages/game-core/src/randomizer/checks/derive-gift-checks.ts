/* @layer bridge-wasm @kind logic */
import type { CheckDef } from './check.type';
import { findGiftOperands } from './find-gift-operands';
import {
  CTAS_TYPE_SCENE_HEADER, CTAS_TYPE_SCRIPT, GIFT_ID_PREFIX, SCENE_HEADER_SCRIPT_AT, SCENE_LOCATIONS,
} from './gift-ops.constants';
import { readPackEntries } from './read-pack-entries';
import type { PackEntry } from './read-pack-entries.type';

const locationChecks = (pack: Uint8Array, loc: number, script: PackEntry): CheckDef[] =>
  findGiftOperands(pack.subarray(script.start, script.start + script.length)).map((g, n) => ({
    id: `${GIFT_ID_PREFIX}-${loc.toString(16).padStart(3, '0')}-${n}`,
    kind: 'gift',
    locationId: loc,
    vanillaItem: g.item,
    scriptId: script.id,
    patchAt: g.patchAt,
  }));

const deriveGiftChecks = (pack: Uint8Array): CheckDef[] => {
  const entries = readPackEntries(pack);
  const headers = new Map<number, PackEntry>();
  const scripts = new Map<number, PackEntry>();
  entries.forEach((e) => {
    if (e.type === CTAS_TYPE_SCENE_HEADER) headers.set(e.id, e);
    if (e.type === CTAS_TYPE_SCRIPT) scripts.set(e.id, e);
  });
  const checks: CheckDef[] = [];
  for (let loc = 0; loc < SCENE_LOCATIONS; loc += 1) {
    const header = headers.get(loc);
    if (!header || header.length <= SCENE_HEADER_SCRIPT_AT + 1) continue;
    const at = header.start + SCENE_HEADER_SCRIPT_AT;
    const script = scripts.get((pack[at] ?? 0) | ((pack[at + 1] ?? 0) << 8));
    if (script) checks.push(...locationChecks(pack, loc, script));
  }
  return checks;
};

export { deriveGiftChecks };
