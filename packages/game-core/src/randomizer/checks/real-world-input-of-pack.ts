/* @layer bridge-wasm @kind logic */
import type { CtOptionValues, CtWorldInput } from '../world/ct-world-input.type';
import type { CtSpotId } from '../world/ct-world-keys.type';
import type { CtStartParty } from '../world/party/ct-party.type';
import { deriveChestChecks } from './derive-chest-checks';
import { deriveGiftChecks } from './derive-gift-checks';
import { deriveSealedCheckIds } from './derive-sealed-check-ids';
import { spotGiftChecksOf } from './spot-gift-checks-of';

const realWorldInputOfPack = (pack: Uint8Array, options?: CtOptionValues, startParty?: CtStartParty): CtWorldInput => {
  const spots = spotGiftChecksOf(options);
  const bound = new Map(spots.map((check): [CtSpotId, string] => [check.id as CtSpotId, check.id]));
  return {
    checks: [...deriveChestChecks(pack), ...deriveGiftChecks(pack), ...spots],
    ...(spots.length === 0 ? {} : { spotChecks: bound }),
    sealedCheckIds: deriveSealedCheckIds(pack),
    options,
    ...(startParty === undefined ? {} : { startParty }),
  };
};

export { realWorldInputOfPack };
