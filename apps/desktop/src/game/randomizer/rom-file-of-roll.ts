/* @layer bridge-wasm @kind logic */
import type { RollContext } from '@drizztdourden08/brock-randomizer';
import { useProfilesStore } from '@drizztdourden08/brock-react';

const romFileOfRoll = (ctx: RollContext): string | undefined =>
  ctx.create?.romFile ?? useProfilesStore.getState().profiles.find((profile) => profile.id === ctx.profileId)?.romFile;

export { romFileOfRoll };
