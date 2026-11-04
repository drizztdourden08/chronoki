/* @layer renderer-appshell @kind logic */
import { hostGate } from '@chronoki/game-core';
import { activeGameHolder } from '@app/game/lifecycle';
import { autoSaveTick, saveStateOnQuit } from '@app/game/auto-save';
import type { SaveSection } from './probe-host-saves.type';

const autoIds = async (profileId: string): Promise<string[]> => {
  const game = activeGameHolder.current;
  const entries = (await game?.store.named.list(profileId, 'auto')) ?? [];
  return entries.map((entry) => entry.id);
};

const created = async (profileId: string, before: string[], run: () => Promise<void>): Promise<number> => {
  await run();
  return (await autoIds(profileId)).filter((id) => !before.includes(id)).length;
};

const removeCreated = async (profileId: string, before: string[]): Promise<void> => {
  const game = activeGameHolder.current;
  for (const id of await autoIds(profileId)) {
    if (!before.includes(id)) await game?.store.named.remove(profileId, 'auto', id);
  }
};

const probeHostSaves = async (errors: string[]): Promise<{ autoSave: SaveSection; saveOnQuit: SaveSection }> => {
  const game = activeGameHolder.current;
  const profileId = game?.profileId;
  if (!game || !profileId) {
    errors.push('no running game with a profile');
    return { autoSave: { expected: false, created: 0 }, saveOnQuit: { expected: false, created: 0 } };
  }
  const before = await autoIds(profileId);
  const autoSave = { expected: hostGate('autoSave'), created: await created(profileId, before, autoSaveTick) };
  const afterTick = await autoIds(profileId);
  const saveOnQuit = { expected: hostGate('saveOnQuit'), created: await created(profileId, afterTick, () => saveStateOnQuit(game)) };
  await removeCreated(profileId, before);
  if (autoSave.created !== (autoSave.expected ? 1 : 0)) errors.push('auto-save did not match the gate');
  if (saveOnQuit.created !== (saveOnQuit.expected ? 1 : 0)) errors.push('save on quit did not match the gate');
  return { autoSave, saveOnQuit };
};

export { probeHostSaves };
