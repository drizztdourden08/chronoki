/* @layer tests @kind helper */
import { AP_GAME, AP_WORLD_VERSION, CT_AP_ITEM_IDS, CT_AP_LOCATION_IDS } from '@chronoki/game-core/archipelago';
import { makeRoom } from '@drizztdourden08/brock-randomizer/test-kit';
import type { FakeRoom, HarnessAdapter } from '@drizztdourden08/brock-randomizer/test-kit';
import { chronokiApLocationKeyOf } from '@app/game/randomizer/archipelago/chronoki-ap-location-key-of';
import { chronokiApSlot } from '@app/game/randomizer/archipelago/chronoki-ap-slot';

const SEED_TEXT = 'online-session-test';
const SLOT_NAME = 'Link';

const [LOCATION_KEY = '', SECOND_LOCATION_KEY = ''] = Object.keys(CT_AP_LOCATION_IDS);
const [ITEM_KEY = ''] = Object.keys(CT_AP_ITEM_IDS);

const locationIdOf = (key: string): number => CT_AP_LOCATION_IDS[key] ?? -1;
const itemIdOf = (key: string): number => CT_AP_ITEM_IDS[key] ?? -1;

const adapter: HarnessAdapter = {
  game: AP_GAME,
  slot: chronokiApSlot,
  locationKeyOf: chronokiApLocationKeyOf,
};

const ctRoom = (overrides: Partial<FakeRoom> = {}): FakeRoom => {
  const ids = [locationIdOf(LOCATION_KEY), locationIdOf(SECOND_LOCATION_KEY)];
  return makeRoom({
    games: {
      [AP_GAME]: {
        item_name_to_id: { [ITEM_KEY]: itemIdOf(ITEM_KEY) },
        location_name_to_id: { [LOCATION_KEY]: ids[0] ?? -1, [SECOND_LOCATION_KEY]: ids[1] ?? -1 },
        checksum: 'ct-1',
      },
      Other: { item_name_to_id: { 'Other Sword': 500 }, location_name_to_id: { 'Other Place': 900 }, checksum: 'other-1' },
    },
    checked: [],
    missing: ids,
    placements: {
      [ids[0] ?? -1]: { item: itemIdOf(ITEM_KEY), location: ids[0] ?? -1, player: 1, flags: 0 },
      [ids[1] ?? -1]: { item: 500, location: ids[1] ?? -1, player: 2, flags: 0 },
    },
    slotData: { worldVersion: AP_WORLD_VERSION, seed: SEED_TEXT, options: {}, deathLink: false },
    seedName: SEED_TEXT,
    ...overrides,
  }, AP_GAME);
};

export { ITEM_KEY, LOCATION_KEY, SECOND_LOCATION_KEY, SLOT_NAME, adapter, ctRoom, itemIdOf, locationIdOf };
