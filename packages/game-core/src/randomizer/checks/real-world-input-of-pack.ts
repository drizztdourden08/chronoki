/* @layer bridge-wasm @kind logic */
import type { CtOptionValues, CtWorldInput } from '../world/ct-world-input.type';
import type { CtStartParty } from '../world/party/ct-party.type';
import { deriveChestChecks } from './derive-chest-checks';
import { deriveGiftChecks } from './derive-gift-checks';
import { deriveSealedCheckIds } from './derive-sealed-check-ids';
import { spotChecksOf } from './spot-checks-of';
import { spotGiftChecksOf } from './spot-gift-checks-of';

const realWorldInputOfPack = (pack: Uint8Array, options?: CtOptionValues, startParty?: CtStartParty): CtWorldInput => {
  const checks = [...deriveChestChecks(pack), ...deriveGiftChecks(pack), ...spotGiftChecksOf(options)];
  const spotChecks = spotChecksOf(checks);
  return {
    checks,
    ...(spotChecks === undefined ? {} : { spotChecks }),
    sealedCheckIds: deriveSealedCheckIds(pack),
    options,
    ...(startParty === undefined ? {} : { startParty }),
  };
};

export { realWorldInputOfPack };
