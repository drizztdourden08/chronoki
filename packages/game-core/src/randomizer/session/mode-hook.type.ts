/* @layer bridge-wasm @kind type */
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import type { CtOptionValues } from '../world/ct-world-input.type';
import type { WramWrite } from './start-gold-grant.type';

type ModeHook = {
  observe(view: MemoryView, started: boolean, newGame: boolean): void;
  reset(): void;
};

type ModeHookFactory = (options: CtOptionValues, write: WramWrite) => ModeHook;

export type { ModeHook, ModeHookFactory };
