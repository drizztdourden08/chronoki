/* @layer root-config @kind config */
import { defineWorkspace, electronTarget, brockProfile } from '@drizztdourden08/brock-thread';
import { plugin as snesPlugin } from '@drizztdourden08/brock-plugin-snes';

export default defineWorkspace({
  name: 'chronoki',
  base: 'main',
  targets: {
    app: electronTarget({ app: 'apps/desktop' }),
  },
  provision: [brockProfile()],
  plugins: [snesPlugin],
  snes: {
    wasm: {
      output: 'apps/desktop/public/wasm',
      sourceDirs: ['core/reconnect', 'core/wasm-build'],
      sourceExtensions: ['.c', '.h', '.mjs'],
    },
    // TODO: the ROM SHA-1 table is filled by @chronoki/game-data once the supported dumps are confirmed.
    roms: { sha1: {} },
  },
});
