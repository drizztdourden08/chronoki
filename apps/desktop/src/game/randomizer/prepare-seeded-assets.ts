/* @layer bridge-wasm @kind logic */
import type { RandomizerProfileConfig } from '@drizztdourden08/brock-randomizer';
import type { FileStore } from '@drizztdourden08/brock-core';
import { resolveMysteryOptions, withCtOptionDefaults } from '@chronoki/game-core';
import { pendingBoot, onlineConnectionOf } from '@drizztdourden08/brock-randomizer/session';
import { gateRandomizerBoot } from '@drizztdourden08/brock-randomizer/renderer';
import type { RoomCache } from './archipelago/room-cache.type';
import { BOOT_REFUSALS, LOCAL_MODE, ONLINE_MODE } from './chronoki-randomizer.constants';
import { checksOfPack } from './checks-of-pack';
import { localRunHolder } from './local-run-holder';
import { onlinePlacementOf } from './online-placement-of';
import { randomizerConfigOf } from './randomizer-config-of';
import { savePlacement } from './save-placement';
import type { SeededAssets } from './seeded-assets.type';
import { writeSeedToPack } from './write-seed-to-pack';

const refuse = (reason: string): SeededAssets => {
  pendingBoot.clear();
  return { ok: false, reason };
};

const modeRefusalOf = (config: RandomizerProfileConfig): string | null => {
  if (config.mode === LOCAL_MODE) return null;
  if (config.mode === ONLINE_MODE) return null;
  return BOOT_REFUSALS.lobbyNotStarted;
};

const roomOf = async (profileId: string, config: RandomizerProfileConfig, files: FileStore): Promise<RoomCache | string> => {
  if (config.mode === LOCAL_MODE) {
    const placement = pendingBoot.get()?.placement as RoomCache['placement'] | undefined;
    return placement === undefined ? BOOT_REFUSALS.noPlacement : { placement, options: config.options };
  }
  const connection = onlineConnectionOf(config);
  if (connection === null) return BOOT_REFUSALS.noConnection;
  return (await onlinePlacementOf(profileId, connection, files)) ?? BOOT_REFUSALS.roomUnreachable;
};

const prepareSeededAssets = async (profileId: string | null, assets: Uint8Array, files: FileStore): Promise<SeededAssets> => {
  localRunHolder.applied = null;
  const config = profileId === null ? undefined : randomizerConfigOf(profileId);
  if (profileId === null || config === undefined) return { ok: true, assets };
  const modeRefusal = modeRefusalOf(config);
  if (modeRefusal !== null) return refuse(modeRefusal);
  const gate = await gateRandomizerBoot(profileId, config);
  if (!gate.ok) return refuse(gate.reason);
  const room = await roomOf(profileId, config, files);
  if (typeof room === 'string') return refuse(room);
  const { placement } = room;
  const options = resolveMysteryOptions(config.mode === LOCAL_MODE ? room.options : withCtOptionDefaults(room.options), placement.seed);
  const checks = checksOfPack(assets, options);
  if (checks.length === 0) return refuse(BOOT_REFUSALS.noChecks);
  const seeded = writeSeedToPack({ profileId, placement, checks, assets, options });
  if (!seeded.ok) pendingBoot.clear();
  else await savePlacement(files, profileId, placement);
  return seeded;
};

export { prepareSeededAssets };
