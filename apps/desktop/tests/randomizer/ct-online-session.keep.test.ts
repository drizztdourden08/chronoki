/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { AP_GAME } from '@chronoki/game-core/archipelago';
import { boot, installClientHarness, item, settle } from '@drizztdourden08/brock-randomizer/test-kit';
import { ITEM_KEY, LOCATION_KEY, SECOND_LOCATION_KEY, SLOT_NAME, adapter, ctRoom, itemIdOf, locationIdOf } from './ct-online-harness';

installClientHarness();

const OTHER_PLAYER = 2;
const OTHER_PLAYER_NAME = 'Zelda';
const FOREIGN_LOCATION = 900;

describe('a ChronoKi online session against the fake server', { tags: ['critical'] }, () => {
  it('connects as the slot, names the game and goes active', async () => {
    const { server, session } = await boot(ctRoom(), adapter);
    expect(session.status).toBe('active');
    expect(session.networkStatus.connection).toMatchObject({ state: 'connected', error: null });
    const [connect] = server.of('Connect');
    expect(connect).toMatchObject({ game: AP_GAME, name: SLOT_NAME });
    expect(server.of('Connect')).toHaveLength(1);
  });

  it('reads the slot data into a placement of the room checks', async () => {
    const { session } = await boot(ctRoom(), adapter);
    expect(session.placement).toMatchObject({ seed: expect.any(String) });
    const locations = (session.placement as { locations: [string, string][] }).locations.map(([location]) => location);
    expect(locations).toContain(LOCATION_KEY);
  });

  it('delivers an item another player found, naming who sent it', async () => {
    const room = ctRoom({ items: [item(itemIdOf(ITEM_KEY), OTHER_PLAYER, FOREIGN_LOCATION)] });
    const { core } = await boot(room, adapter);
    expect(core.delivered).toEqual([{ itemName: ITEM_KEY, sender: OTHER_PLAYER_NAME }]);
    expect(core.index).toBe(1);
  });

  it('delivers an item the server gave as coming from the server', async () => {
    const room = ctRoom({ items: [item(itemIdOf(ITEM_KEY), 1, -1)] });
    const { core } = await boot(room, adapter);
    expect(core.delivered).toEqual([{ itemName: ITEM_KEY, sender: null }]);
  });

  it('delivers an item that arrives after the session is active', async () => {
    const { server, core } = await boot(ctRoom(), adapter);
    expect(core.delivered).toEqual([]);
    server.push([{
      cmd: 'ReceivedItems', index: 0, items: [item(itemIdOf(ITEM_KEY), OTHER_PLAYER, FOREIGN_LOCATION)],
    }]);
    await settle();
    expect(core.delivered.map((delivery) => delivery.itemName)).toEqual([ITEM_KEY]);
  });

  it('sends no check before the player makes one', async () => {
    const { server } = await boot(ctRoom(), adapter);
    expect(server.of('LocationChecks')).toEqual([]);
  });

  it('sends a location check the player makes in the game', async () => {
    const { server, core } = await boot(ctRoom(), adapter);
    core.report?.(locationIdOf(SECOND_LOCATION_KEY));
    await settle();
    expect(server.of('LocationChecks').flatMap((packet) => packet.locations)).toContain(locationIdOf(SECOND_LOCATION_KEY));
  });

  it('refuses a room whose slot data is from another world version', async () => {
    const room = ctRoom({ slotData: { worldVersion: '0.0.0-other', seed: 'x', options: {}, deathLink: false } });
    const { session } = await boot(room, adapter);
    expect(session.status).toBe('error');
  });
});
