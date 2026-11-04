/* @layer root-config @kind config */
import { join } from 'node:path';
import { defineWorkspace, electronTarget, brockProfile } from '@drizztdourden08/brock-thread';
import { plugin as snesPlugin, snes as snesVerb } from '@drizztdourden08/brock-plugin-snes';

const STAGED_DATA = ['test-roms', 'data'];
const STAGED_PACK = 'ct_assets.dat';

const assetBlobStep = {
  name: 'asset-blob',
  run: (worktree) => snesVerb.copyAssetBlob({ realDataDir: join(worktree.main, ...STAGED_DATA), asset: STAGED_PACK }).run(worktree),
};

export default defineWorkspace({
  name: 'chronoki',
  base: 'main',
  targets: {
    app: electronTarget({ app: 'apps/desktop' }),
  },
  provision: [brockProfile(), assetBlobStep],
  plugins: [snesPlugin],
  snes: {
    wasm: {
      output: 'apps/desktop/public/wasm',
      sourceDirs: ['core/reconnect', 'core/wasm-build'],
      sourceExtensions: ['.c', '.h', '.mjs'],
    },
    roms: { sha1: { DE5822F4F2F7A55ACB8926D4C0EAA63D5D989312: 'ct-usa' } },
    states: { launchFlags: { game: ['--auto-start'], save: ['--auto-state={state}'] } },
  },
});
