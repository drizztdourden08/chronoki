/* @layer renderer-components @kind logic */
import { useCallback } from 'react';
import type { CtCharacter } from '@chronoki/game-core';
import { toggleMember } from './toggle-party-member';

const usePartySelection = (value: readonly CtCharacter[], onChange: (next: readonly CtCharacter[]) => void) => {
  const toggle = useCallback((id: CtCharacter) => onChange(toggleMember(value, id)), [value, onChange]);
  const clear = useCallback(() => onChange([]), [onChange]);
  return { toggle, clear };
};

export { usePartySelection };
