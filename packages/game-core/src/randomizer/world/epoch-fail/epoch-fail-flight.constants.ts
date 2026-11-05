/* @layer bridge-wasm @kind constants */
import type { CtSpotId } from '../ct-world-keys.type';
import type { FlightExit } from './epoch-fail-flight.constants.type';

const JETS_ROM_ID = 0xea;

const FLIGHT_SPOTS: readonly CtSpotId[] = [
  'ki-sun-palace', 'ki-geno-dome', 'ki-giants-claw', 'ki-cyrus-grave', 'ki-ozzies-fort', 'ki-carpenters-wife',
  'ki-melchior-sun-stone',
];

const FLIGHT_EXITS: readonly FlightExit[] = [
  { from: 'middle-ages', to: 'giants-claw' },
  { from: 'middle-ages', to: 'northern-ruins' },
];

export { FLIGHT_EXITS, FLIGHT_SPOTS, JETS_ROM_ID };
