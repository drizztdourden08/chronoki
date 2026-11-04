/* @layer renderer-components @kind hook */
import { useCallback, useState } from 'react';
import type { FunctionAction, InputBinding, InputProfile, SnesButton } from '@chronoki/input-mapping';
import { getInputManager } from '../input-manager/get-input-manager';
import { addProfile } from '../profile-store/add-profile';
import { removeProfile } from '../profile-store/remove-profile';
import { replaceProfile } from '../profile-store/replace-profile';
import { selectProfile } from '../profile-store/select-profile';
import { storeFunctionMappings } from '../profile-store/store-function-mappings';
import { bindFunctionAction } from '../profile-edit/bind-function-action';
import { bindSnesButton } from '../profile-edit/bind-snes-button';
import { buildControllerProfile } from '../profile-edit/build-controller-profile';
import { buildCustomProfile } from '../profile-edit/build-custom-profile';
import { buildPresetProfile } from '../profile-edit/build-preset-profile';
import { clearSnesMapping } from '../profile-edit/clear-snes-mapping';
import { NO_BINDING } from '../profile-edit/profile-edit.constants';
import type { DevicePreset } from '../profile-edit/profile-edit.type';
import type { MutationArgs, Mutations } from './useProfileMutations.type';

const useProfileMutations = ({ activeProfile, profiles, functionMappings, sync }: MutationArgs): Mutations => {
  const [newlyCreatedId, setNewlyCreatedId] = useState<string | null>(null);

  const run = useCallback((task: Promise<void>) => { void task.then(sync); }, [sync]);

  const select = useCallback((profile: InputProfile) => run(selectProfile(getInputManager(), profile)), [run]);

  const add = useCallback((profile: InputProfile) => {
    setNewlyCreatedId(profile.id);
    run(addProfile(getInputManager(), profile));
  }, [run]);

  const create = useCallback(() => add(buildCustomProfile(profiles.length)), [add, profiles.length]);
  const createForDevice = useCallback((preset: DevicePreset) => add(buildControllerProfile(preset, profiles.length)), [add, profiles.length]);

  const rename = useCallback((profile: InputProfile, name: string) => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== profile.name) run(replaceProfile(getInputManager(), { ...profile, name: trimmed, modifiedAt: Date.now() }));
  }, [run]);

  const remove = useCallback((profile: InputProfile) => run(removeProfile(getInputManager(), profile.id)), [run]);

  const update = useCallback((profile: InputProfile) => run(replaceProfile(getInputManager(), profile)), [run]);

  const bindSnes = useCallback((button: SnesButton, binding: InputBinding, vid: string | null, pid: string | null) => {
    if (activeProfile) update(bindSnesButton({ profile: activeProfile, button, binding, vid, pid }));
  }, [activeProfile, update]);

  const clearSnes = useCallback((button: SnesButton, mappingIndex: number) => {
    if (activeProfile) update(clearSnesMapping({ profile: activeProfile, button, mappingIndex }));
  }, [activeProfile, update]);

  const bindFunction = useCallback((action: FunctionAction, binding: InputBinding, vid: string | null, pid: string | null) => {
    run(storeFunctionMappings(getInputManager(), bindFunctionAction({ mappings: functionMappings, action, binding, vid, pid })));
  }, [functionMappings, run]);

  const clearFunction = useCallback((action: FunctionAction) => bindFunction(action, NO_BINDING, null, null), [bindFunction]);

  const applyToActive = useCallback((preset: DevicePreset) => {
    if (activeProfile) update(buildPresetProfile(preset, activeProfile));
  }, [activeProfile, update]);

  return { newlyCreatedId, select, create, rename, remove, bindSnes, clearSnes, bindFunction, clearFunction, createForDevice, applyToActive };
};

export { useProfileMutations };
