/* @layer bridge-wasm @kind logic */
import type { RandomizerProfileConfig } from '@drizztdourden08/brock-randomizer';
import type { FileStore } from '@drizztdourden08/brock-core';
import type { CtPlacement } from '@chronoki/game-core';
import { gateRandomizerBoot, pendingBoot } from '@drizztdourden08/brock-randomizer/session';
import { BOOT_REFUSALS, LOCAL_MODE } from './chronoki-randomizer.constants';
import { checksOfPack } from './checks-of-pack';
import { localRunHolder } from './local-run-holder';
import { randomizerConfigOf } from './randomizer-config-of';
import { savePlacement } from './save-placement';
import type { SeededAssets } from './seeded-assets.type';
import { writeSeedToPack } from './write-seed-to-pack';

const refuse = (reason: string): SeededAssets => {
  pendingBoot.clear();
  return { ok: false, reason };
};

const modeRefusalOf = (config: RandomizerProfileConfig): string | null =>
  config.mode === LOCAL_MODE ? null : BOOT_REFUSALS.notLocal;

const prepareSeededAssets = async (profileId: string | null, assets: Uint8Array, files: FileStore): Promise<SeededAssets> => {
  localRunHolder.applied = null;
  const config = profileId === null ? undefined : randomizerConfigOf(profileId);
  if (profileId === null || config === undefined) return { ok: true, assets };
  const modeRefusal = modeRefusalOf(config);
  if (modeRefusal !== null) return refuse(modeRefusal);
  const checks = checksOfPack(assets);
  if (checks.length === 0) return refuse(BOOT_REFUSALS.noChecks);
  const gate = await gateRandomizerBoot(profileId, config);
  if (!gate.ok) return refuse(gate.reason);
  const placement = pendingBoot.get()?.placement as CtPlacement | undefined;
  if (placement === undefined) return refuse(BOOT_REFUSALS.noPlacement);
  const seeded = writeSeedToPack({ profileId, placement, checks, assets, options: config.options });
  if (!seeded.ok) pendingBoot.clear();
  else await savePlacement(files, profileId, placement);
  return seeded;
};

export { prepareSeededAssets };
