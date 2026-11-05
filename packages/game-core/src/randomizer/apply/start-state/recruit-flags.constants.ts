/* @layer bridge-wasm @kind constants */
import type { CtCharacter } from '../../world/ct-world-keys.type';
import type { CtFlagBit } from './ct-start-state.type';

const CT_RECRUIT_FLAGS: Readonly<Record<CtCharacter, readonly CtFlagBit[]>> = {
  crono: [],
  marle: [{ at: 0x7f00a1, bits: 0x04 }],
  lucca: [],
  robo: [],
  frog: [{ at: 0x7f00ff, bits: 0x10 }],
  ayla: [
    { at: 0x7f01df, bits: 0x04 },
    { at: 0x7f0160, bits: 0x07 },
  ],
  magus: [],
};

export { CT_RECRUIT_FLAGS };
