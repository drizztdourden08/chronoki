/* @layer bridge-wasm @kind logic */
import type { CheckDef } from '../checks/check.type';
import type { CtOptionValues, CtWorldInput } from '../world/ct-world-input.type';
import type { CtStartParty } from '../world/party/ct-party.type';
import { VERIFY_CHECK_COUNT, VERIFY_MAPS, VERIFY_SEALED_COUNT } from './verify.constants';

const chestOf = (n: number): CheckDef => ({
  id: `chest-verify-${n}`, kind: 'chest', locationId: VERIFY_MAPS[n % VERIFY_MAPS.length] ?? 0, vanillaItem: n + 1,
});

const verifyInputOf = (options: CtOptionValues, startParty: CtStartParty): CtWorldInput => ({
  checks: Array.from({ length: VERIFY_CHECK_COUNT }, (_, n) => chestOf(n)),
  sealedCheckIds: new Set(Array.from({ length: VERIFY_SEALED_COUNT }, (_, n) => `chest-verify-${n}`)),
  options,
  startParty,
});

export { verifyInputOf };
