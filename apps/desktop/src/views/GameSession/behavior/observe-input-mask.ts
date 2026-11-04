/* @layer renderer-appshell @kind logic */
import { chronokiCore } from '@app/game/lifecycle';
import { SET_INPUT_CALL } from '@app/input/input.constants';
import type { MaskObserver } from './observe-input-mask.type';

const observeInputMask = (): MaskObserver => {
  const mod = chronokiCore.module();
  const name = `_${SET_INPUT_CALL}`;
  const original = mod?.[name];
  const seen = new Set<number>();
  if (mod && typeof original === 'function') {
    mod[name] = (mask: number): unknown => {
      seen.add(mask);
      return (original as (mask: number) => unknown)(mask);
    };
  }
  return {
    masks: () => [...seen].sort((a, b) => a - b),
    stop: () => {
      if (mod && original !== undefined) mod[name] = original;
    },
  };
};

export { observeInputMask };
