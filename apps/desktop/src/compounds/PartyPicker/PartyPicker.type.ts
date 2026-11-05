/* @layer renderer-components @kind types */
import type { CtCharacter } from '@chronoki/game-core';

interface PartyPickerProps {
  value: readonly CtCharacter[];
  onChange: (next: readonly CtCharacter[]) => void;
  frozen?: boolean;
  spriteUrlOf?: (id: CtCharacter) => string | null;
}

interface PartyTileProps {
  id: CtCharacter;
  slot: number;
  disabled: boolean;
  spriteUrl: string | null;
  onToggle: (id: CtCharacter) => void;
}

export type { PartyPickerProps, PartyTileProps };
