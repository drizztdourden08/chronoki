/* @layer bridge-wasm @kind constants */
import { CT_CHARACTERS } from '../world/party/ct-party.constants';
import type { CtStartParty } from '../world/party/ct-party.type';

const VERIFY_MAPS: readonly number[] = [0x001, 0x087, 0x0c4, 0x0d6, 0x121, 0x18d, 0x3ff];

const VERIFY_CHECK_COUNT = 42;

const VERIFY_SEALED_COUNT = 3;

const REFUSED_PARTIES: readonly string[] = [];

const VERIFY_DEFAULT_SEEDS = 25;

const VERIFY_DEFAULT_BASE = 'verify';

const VERIFY_SAMPLE = 5;

const SUBSET_COUNT = (1 << CT_CHARACTERS.length) - 1;

const ALL_SUBSETS: readonly CtStartParty[] = Array.from({ length: SUBSET_COUNT }, (_, index) =>
  CT_CHARACTERS.filter((_id, bit) => (index + 1) & (1 << bit)));

export {
  ALL_SUBSETS, REFUSED_PARTIES, VERIFY_CHECK_COUNT, VERIFY_DEFAULT_BASE, VERIFY_DEFAULT_SEEDS, VERIFY_MAPS, VERIFY_SAMPLE, VERIFY_SEALED_COUNT };
