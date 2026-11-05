/* @layer renderer-components @kind types */
import type { CtCharacter } from '@chronoki/game-core';

interface PartyPickerProps {
  value: readonly CtCharacter[];
  onChange: (next: readonly CtCharacter[]) => void;
  frozen?: boolean;
  spriteUrlOf?: (id: CtCharacter) => string | null;
}

export type { PartyPickerProps };
