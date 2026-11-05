/* @layer bridge-wasm @kind logic */
import type { CtOptionValues, CtWorldInput } from '../world/ct-world-input.type';
import type { CtStartParty } from '../world/party/ct-party.type';
import { deriveChestChecks } from './derive-chest-checks';
import { deriveGiftChecks } from './derive-gift-checks';
import { deriveSealedCheckIds } from './derive-sealed-check-ids';

const realWorldInputOfPack = (pack: Uint8Array, options?: CtOptionValues, startParty?: CtStartParty): CtWorldInput => ({
  checks: [...deriveChestChecks(pack), ...deriveGiftChecks(pack)],
  sealedCheckIds: deriveSealedCheckIds(pack),
  options,
  ...(startParty === undefined ? {} : { startParty }),
});

export { realWorldInputOfPack };
