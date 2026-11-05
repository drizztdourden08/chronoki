/* @layer bridge-wasm @kind logic */
import type { MemoryBridge } from '@drizztdourden08/brock-randomizer/memory';
import type { HeadlessGrants } from './create-headless-grants.type';
import { createCtMemoryBridge } from '../../memory/create-ct-memory-bridge';
import { createCtWramWriter } from '../../memory/create-ct-wram-writer';
import type { CtMemoryOptions } from '../../memory/ct-memory-options.type';
import { createGameStartWatch } from '../../session/create-game-start-watch';
import { createStartGoldGrant } from '../../session/create-start-gold-grant';
import { createStartMagicGrant } from '../../session/create-start-magic-grant';
import { HARD_START_GOLD } from '../../world/treasure-tiers/treasure-tiers.constants';
import type { CtOptionValues } from '../../world/ct-world-input.type';

const createHeadlessGrants = (options: CtOptionValues, memory: CtMemoryOptions): HeadlessGrants => {
  const bridge: MemoryBridge = createCtMemoryBridge(memory);
  const write = createCtWramWriter(memory, bridge);
  const watch = createGameStartWatch();
  const gold = options.itemDifficulty === 'hard' ? createStartGoldGrant(write, HARD_START_GOLD) : null;
  const magic = options.unlockedMagic === true ? createStartMagicGrant(write) : null;
  return {
    observe: () => {
      const view = bridge.view();
      if (view === null) return;
      watch.observe(view);
      gold?.observe(watch.started() && watch.newGame(), view);
      magic?.observe(watch.started() && watch.newGame(), view);
    },
    started: () => watch.started(),
    goldGranted: () => gold?.granted() ?? false,
    magicGranted: () => magic?.granted() ?? false,
    view: () => bridge.view(),
  };
};

export { createHeadlessGrants };
