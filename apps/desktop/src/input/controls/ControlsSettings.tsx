/* @layer renderer-components @kind component */
import { useCallback, useState } from 'react';
import { Box, ScrollArea, Tabs } from '@drizztdourden08/tessera/primitives';
import { Dialog } from '@drizztdourden08/tessera/composites';
import { SearchAnchor } from '@drizztdourden08/brock-react';
import type { InputProfile } from '@chronoki/input-mapping';
import type { DevicePreset } from '../profile-edit/profile-edit.type';
import { BindingListener } from './BindingListener';
import { DevicesPanel } from './DevicesPanel';
import { FunctionBindingsTab } from './FunctionBindingsTab';
import { ProfilesPanel } from './ProfilesPanel';
import { SnesBindingsTab } from './SnesBindingsTab';
import { CONTROLS_TABS } from './controls.constants';
import { listeningLabel } from './listening-label';
import { useCapture } from './useCapture';
import { useControlsState } from './useControlsState';
import type { ControlsProps, ControlsTab } from './controls.type';
import './ControlsSettings.css';

const ControlsSettings = ({ profileId }: ControlsProps) => {
  const ctrl = useControlsState(profileId);
  const { listeningFor, setListeningFor, handleCapture, cancel } = useCapture(ctrl);
  const [tab, setTab] = useState<ControlsTab>('controls');
  const [deleteTarget, setDeleteTarget] = useState<InputProfile | null>(null);
  const [presetTarget, setPresetTarget] = useState<DevicePreset | null>(null);

  const handleTabChange = useCallback((id: string) => setTab(id === 'shortcuts' ? 'shortcuts' : 'controls'), []);
  const cancelDelete = useCallback(() => setDeleteTarget(null), []);
  const confirmDelete = useCallback(() => {
    if (deleteTarget) ctrl.remove(deleteTarget);
    setDeleteTarget(null);
  }, [ctrl, deleteTarget]);

  const cancelPreset = useCallback(() => setPresetTarget(null), []);
  const confirmPreset = useCallback(() => {
    if (presetTarget) ctrl.applyToActive(presetTarget);
    setPresetTarget(null);
  }, [ctrl, presetTarget]);

  return (
    <Box className="controls-settings">
      <Box className="controls-settings__layout">
        <SearchAnchor anchor="input-profiles" className="controls-settings__anchor">
          <ProfilesPanel ctrl={ctrl} onDelete={setDeleteTarget} />
        </SearchAnchor>
        <SearchAnchor anchor="bindings" className="controls-settings__anchor controls-settings__anchor--main">
          <Box className="controls-settings__main">
            <Tabs tabs={CONTROLS_TABS} activeTab={tab} onTabChange={handleTabChange} />
            <ScrollArea className="controls-settings__body">
              {tab === 'controls'
                ? <SnesBindingsTab ctrl={ctrl} onRebind={(button) => setListeningFor({ type: 'snes', button })} />
                : <FunctionBindingsTab ctrl={ctrl} onRebind={(action) => setListeningFor({ type: 'function', action })} />}
            </ScrollArea>
          </Box>
        </SearchAnchor>
        <SearchAnchor anchor="devices" className="controls-settings__anchor">
          <DevicesPanel ctrl={ctrl} onApply={setPresetTarget} />
        </SearchAnchor>
      </Box>

      {listeningFor && <BindingListener actionLabel={listeningLabel(listeningFor)} onCapture={handleCapture} onCancel={cancel} />}

      <Dialog
        open={Boolean(deleteTarget)}
        title="Delete Input Profile"
        message={`Delete "${deleteTarget?.name ?? ''}"? This cannot be undone.`}
        variant="danger"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <Dialog
        open={Boolean(presetTarget)}
        title="Apply Controller Preset"
        message={`Assign "${presetTarget?.deviceName ?? ''}" to this profile and apply its default mappings? This will overwrite all current bindings.`}
        variant="danger"
        confirmLabel="Apply"
        cancelLabel="Cancel"
        onConfirm={confirmPreset}
        onCancel={cancelPreset}
      />
    </Box>
  );
};

export { ControlsSettings };
