/* @layer bridge-wasm @kind logic */
import { realWorldInputOfPack } from '../checks/real-world-input-of-pack';
import type { CtOptionValues, CtWorldInput } from '../world/ct-world-input.type';
import type { CtStartParty } from '../world/party/ct-party.type';

const verifyRealInputOf = (pack: Uint8Array, options: CtOptionValues, startParty: CtStartParty): CtWorldInput => {
  const input = realWorldInputOfPack(pack, options, startParty);
  if (input.checks.length === 0) throw new Error('the game pack has no checks the randomizer can read');
  return input;
};

export { verifyRealInputOf };
