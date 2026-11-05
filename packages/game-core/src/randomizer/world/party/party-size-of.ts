/* @layer bridge-wasm @kind logic */
import { PARTY_MAX_SIZE, PARTY_MIN_SIZE } from './ct-party.constants';

const partySizeOf = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < PARTY_MIN_SIZE || value > PARTY_MAX_SIZE) {
    throw new Error(`partySize must be an integer from ${PARTY_MIN_SIZE} to ${PARTY_MAX_SIZE}`);
  }
  return value;
};

export { partySizeOf };
