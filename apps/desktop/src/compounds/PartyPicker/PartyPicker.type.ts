/* @layer renderer-components @kind types */
import type { CtCharacter } from '@chronoki/game-core';

interface PartyPickerProps {
  value: readonly CtCharacter[];
  onChange: (next: readonly CtCharacter[]) => void;
  frozen?: boolean;
  spriteUrlOf?: (id: CtCharacter) => string | null;
}

interface PartySlotGroupProps {
  title: string;
  members: readonly CtCharacter[];
  offset: number;
}

export type { PartyPickerProps, PartySlotGroupProps };
