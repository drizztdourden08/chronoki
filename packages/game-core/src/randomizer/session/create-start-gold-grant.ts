/* @layer bridge-wasm @kind logic */
import { GOLD } from '../../game-info/wram-map.constants';
import { GOLD_BYTES } from './session.constants';
import type { StartGoldGrant, WramWrite } from './start-gold-grant.type';

const goldBytes = (gold: number): Uint8Array =>
  Uint8Array.from({ length: GOLD_BYTES }, (_, i) => Math.floor(gold / 256 ** i) % 256);

const createStartGoldGrant = (write: WramWrite, gold: number): StartGoldGrant => {
  let granted = false;
  return {
    observe: (started) => {
      if (granted || !started) return granted;
      granted = write(GOLD, goldBytes(gold));
      return granted;
    },
    granted: () => granted,
    reset: () => {
      granted = false;
    },
  };
};

export { createStartGoldGrant };
