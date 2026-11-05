/* @layer bridge-wasm @kind logic */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { CT_WRAM_REGION } from '../memory/ct-memory.constants';
import type { WramWrite } from './start-gold-grant.type';
import {
  MAGIC_GATE_AT, MAGIC_GATE_BITS, TAUGHT_CHARACTERS, TECH_BITS, TECH_BITS_AT, TECH_LEVEL, TECH_LEVEL_AT, tpNextAt, tpNextOf,
} from './start-magic-grant.constants';
import type { StartMagicGrant } from './start-magic-grant.type';

const orByte = (write: WramWrite, view: MemoryView, at: number, bits: number): boolean =>
  write(at, Uint8Array.of(view.byte(CT_WRAM_REGION, at) | bits));

const setWord = (write: WramWrite, at: number, word: number): boolean =>
  write(at, Uint8Array.of(word & 0xff, word >> 8));

const createStartMagicGrant = (write: WramWrite): StartMagicGrant => {
  let granted = false;
  const apply = (view: MemoryView): boolean =>
    orByte(write, view, MAGIC_GATE_AT, MAGIC_GATE_BITS)
    && TAUGHT_CHARACTERS.every((id) =>
      orByte(write, view, TECH_LEVEL_AT + id, TECH_LEVEL)
      && orByte(write, view, TECH_BITS_AT + id, TECH_BITS)
      && setWord(write, tpNextAt(id), tpNextOf(id)));
  return {
    observe: (started, view) => {
      if (granted || !started) return granted;
      granted = apply(view);
      return granted;
    },
    granted: () => granted,
    reset: () => {
      granted = false;
    },
  };
};

export { createStartMagicGrant };
