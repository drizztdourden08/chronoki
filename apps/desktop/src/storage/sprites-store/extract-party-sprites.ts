/* @layer renderer-lib @kind logic */
import type { SpriteBuffer } from '@drizztdourden08/brock-port-kit';
import { errorMessage } from '../error-message';
import { runExtractStep } from '../extraction-client';
import { runImportJob } from '../import-job';
import { platformFiles } from '../platform-files';
import { romStoreOf } from '../rom-files';
import { partySpriteStore } from './party-sprite-store';
import { PARTY_SPRITE_SUBDIR } from './sprites-store.constants';
import type { PartySpritesResult } from './sprites-store.type';

const PREFIX = `${PARTY_SPRITE_SUBDIR}/`;

const withoutPrefix = (buffers: SpriteBuffer[]): SpriteBuffer[] =>
  buffers.map(({ name, bytes }) => ({ name: name.startsWith(PREFIX) ? name.slice(PREFIX.length) : name, bytes }));

const extractPartySprites = async (romFile: string): Promise<PartySpritesResult> => {
  try {
    const files = platformFiles();
    const target = romStoreOf(files).assetFileOf(romFile);
    const pack = target ? await files.readBytes(target) : null;
    if (!pack) return { success: false, error: `The game pack is not built yet: ${romFile}` };
    const count = await runImportJob({
      kind: 'sprites',
      title: 'Extracting the party sprites',
      work: async (report) => {
        report.phase('extract', 'Extracting the party sprites...');
        const buffers = await runExtractStep<'sprites', SpriteBuffer[]>({
          step: 'sprites', title: 'Extracting the party sprites', subject: romFile, input: { pack },
        });
        await partySpriteStore.write(files, romFile, withoutPrefix(buffers));
        return buffers.length;
      },
    });
    return { success: true, count };
  } catch (err) {
    return { success: false, error: errorMessage(err) };
  }
};

export { extractPartySprites };
