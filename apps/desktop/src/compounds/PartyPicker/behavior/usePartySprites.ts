/* @layer renderer-components @kind logic */
import { useCallback, useEffect, useState } from 'react';
import type { CtCharacter } from '@chronoki/game-core';
import { CT_CHARACTERS } from '@chronoki/game-core';
import { listRomsWithStatus } from '../../../storage/roms-store';
import { ensurePartySprites, partySpritesUrl } from '../../../storage/sprites-store';

const usePartySprites = (romFile: string | null): ((id: CtCharacter) => string | null) => {
  const [base, setBase] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    const run = async () => {
      const rom = romFile ?? (await listRomsWithStatus()).find((info) => info.hasAssets)?.romFile ?? null;
      if (!rom) return;
      const result = await ensurePartySprites(rom);
      if (live && result.success) setBase(partySpritesUrl(rom));
    };
    run().catch(() => undefined);
    return () => { live = false; };
  }, [romFile]);

  return useCallback((id: CtCharacter) => (base ? `${base}portrait-${CT_CHARACTERS.indexOf(id)}.png` : null), [base]);
};

export { usePartySprites };
