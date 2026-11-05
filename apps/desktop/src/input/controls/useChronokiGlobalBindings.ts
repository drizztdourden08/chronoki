/* @layer renderer-components @kind hook */
import { useMemo } from 'react';
import type { ActionBinding } from '@drizztdourden08/brock-input';
import type { GlobalBindingsStore } from '@drizztdourden08/brock-input/renderer';
import { getInputManager } from '../input-manager/get-input-manager';
import { storeFunctionMappings } from '../profile-store/store-function-mappings';
import { FUNCTION_DEFAULT_BINDINGS } from './controls-game.constants';
import { actionToFunction } from './function-mapping-convert';

const useChronokiGlobalBindings = (mappings: readonly ActionBinding[] | undefined, onChanged: () => void): GlobalBindingsStore =>
  useMemo((): GlobalBindingsStore => ({
    mappings,
    defaults: FUNCTION_DEFAULT_BINDINGS,
    onChange: (next) => {
      void storeFunctionMappings(getInputManager(), next.flatMap(actionToFunction)).then(onChanged);
    },
  }), [mappings, onChanged]);

export { useChronokiGlobalBindings };
