/* @layer root-config @kind config */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';
import { defineWorkspace, electronTarget, brockProfile } from '@drizztdourden08/brock-thread';
import { plugin as snesPlugin, snes as snesVerb } from '@drizztdourden08/brock-plugin-snes';

const STAGED_DATA = ['test-roms', 'data'];
const STAGED_PACK = 'ct_assets.dat';
const PACK_EXTENSION = '.dat';

// The app (and copyAssetBlob) read Data/assets/<ROM stem>.dat; the repack CLI writes ct_assets.dat, so stage it under the ROM's name.
const stageRepackedPack = (worktree) => {
  const pack = join(worktree.main, ...STAGED_DATA, 'assets', STAGED_PACK);
  const romFile = snesVerb.romFileOf(worktree);
  if (!romFile || !existsSync(pack)) return;
  const assetsDir = join(worktree.userData, 'Data', 'assets');
  const asset = `${romFile.slice(0, -extname(romFile).length)}${PACK_EXTENSION}`;
  if (existsSync(join(assetsDir, asset))) return;
  mkdirSync(assetsDir, { recursive: true });
  copyFileSync(pack, join(assetsDir, asset));
  worktree.log(`Pack staged from ${STAGED_PACK} as ${asset}`);
};

const assetBlobStep = {
  name: 'asset-blob',
  run: (worktree) => {
    snesVerb.copyAssetBlob({ realDataDir: join(worktree.main, ...STAGED_DATA) }).run(worktree);
    stageRepackedPack(worktree);
  },
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
