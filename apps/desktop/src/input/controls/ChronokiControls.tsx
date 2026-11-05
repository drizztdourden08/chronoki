/* @layer renderer-components @kind component */
import { useCallback, useState } from 'react';
import type { ActionBinding } from '@drizztdourden08/brock-input';
import { ControlsSettings } from '@drizztdourden08/brock-input/renderer';
import { getInputManager } from '../input-manager/get-input-manager';
import { CONTROLS_GAME } from './controls-game.constants';
import { functionToAction } from './function-mapping-convert';
import { useChronokiGlobalBindings } from './useChronokiGlobalBindings';
import { useChronokiProfileStore } from './useChronokiProfileStore';
import type { ChronokiControlsProps } from './ChronokiControls.type';

const ChronokiControls = ({ profileId }: ChronokiControlsProps) => {
  const [functionBindings, setFunctionBindings] = useState<ActionBinding[] | undefined>(undefined);
  const syncFunctions = useCallback(
    () => setFunctionBindings(getInputManager().getFunctionMappings().map(functionToAction)),
    [],
  );
  const profiles = useChronokiProfileStore(profileId, syncFunctions);
  const globalBindings = useChronokiGlobalBindings(functionBindings, syncFunctions);
  return <ControlsSettings game={CONTROLS_GAME} profiles={profiles} globalBindings={globalBindings} />;
};

export { ChronokiControls };
