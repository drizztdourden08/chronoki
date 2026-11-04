/* @layer renderer-components @kind types */
type HintAction = 'tap-load' | 'hold-save' | 'esc-cancel' | 'holding-save';

interface OverlayHintsProps {
  actions: readonly HintAction[];
  slot: number;
  holdProgress: number;
}

export type { HintAction, OverlayHintsProps };
