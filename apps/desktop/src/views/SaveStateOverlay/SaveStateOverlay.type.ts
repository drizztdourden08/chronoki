/* @layer renderer-components @kind types */
import type { RefObject } from 'react';
import type { ButtonIcon, FunctionMapping, InputBinding } from '@chronoki/input-mapping';
import type { getInputManager } from '@app/input/input-manager/get-input-manager';

type HintAction = 'tap-load' | 'hold-save' | 'esc-cancel' | 'holding-save';

interface SlotHint {
  action: HintAction;
  binding: InputBinding;
  icon: ButtonIcon | null;
}

interface SaveSlotShortcutState {
  open: boolean;
  highlightedSlot: number | null;
  holdProgress: number;
  hints: SlotHint[];
  close: () => void;
}

type BindingInfo = { binding: InputBinding; icon: ButtonIcon | null };

interface SaveStateOverlayProps {
  open: boolean;
  onClose: () => void;
  profileId: string | null;
  highlightedSlot?: number | null;
  holdProgress?: number;
  hints?: SlotHint[];
}

interface HoldState {
  start: number | null;
  anim: number | null;
  slot: number | null;
  complete: boolean;
  awaiting: boolean;
}

interface Cell<T> {
  current: T;
}

interface ShortcutContext {
  enabled: boolean;
  holdDurationMs: number;
  mappings: FunctionMapping[];
  hold: HoldState;
  pending: Cell<number | null>;
  isOpen: Cell<boolean>;
  setOpen: (open: boolean) => void;
  setHighlightedSlot: (slot: number | null) => void;
  setHoldProgress: (progress: number) => void;
  setHints: (hints: SlotHint[]) => void;
  close: () => void;
}

interface SlotActionSpec {
  prefix: 'load-state' | 'save-state';
  label: string;
  verb: string;
  run: (slot: number) => Promise<void>;
}

type InputManager = ReturnType<typeof getInputManager>;

interface OverlayHintsProps {
  hints: SlotHint[];
  holdProgress: number | undefined;
}

interface SlotTrackParams {
  visible: boolean;
  highlightedSlot: number | null | undefined;
}

interface SlotTrack {
  trackRef: RefObject<HTMLDivElement | null>;
  highlightedRef: RefObject<HTMLDivElement | null>;
}

export type {
  BindingInfo,
  HintAction,
  HoldState,
  InputManager,
  OverlayHintsProps,
  SaveSlotShortcutState,
  SaveStateOverlayProps,
  ShortcutContext,
  SlotActionSpec,
  SlotHint,
  SlotTrack,
  SlotTrackParams,
};
