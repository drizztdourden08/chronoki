/* @layer renderer-components @kind component */
import { useCallback, useState } from 'react';
import { Box, ScrollArea, Tabs } from '@drizztdourden08/tessera/primitives';
import { Dialog } from '@drizztdourden08/tessera/composites';
import { SearchAnchor } from '@drizztdourden08/brock-react';
import type { InputProfile } from '@chronoki/input-mapping';
import { BindingListener } from './BindingListener';
import { DevicesPanel } from './DevicesPanel';
import { FunctionBindingsTab } from './FunctionBindingsTab';
import { OptionsTab } from './OptionsTab';
import { ProfilesPanel } from './ProfilesPanel';
import { SnesBindingsTab } from './SnesBindingsTab';
import { CONTROLS_TABS } from './controls.constants';
import { listeningLabel } from './listening-label';
import { useCapture } from './useCapture';
import { useControlsState } from './useControlsState';
import { useControlsNarrow } from './useControlsNarrow';
import { usePresetConfirm } from './usePresetConfirm';
import type { ControlsProps, ControlsTab } from './controls.type';
import './ControlsSettings.css';

const ControlsSettings = ({ profileId }: ControlsProps) => {
  const ctrl = useControlsState(profileId);
  const narrow = useControlsNarrow();
  const { listeningFor, setListeningFor, handleCapture, cancel } = useCapture(ctrl);
  const [tab, setTab] = useState<ControlsTab>('controls');
  const [deleteTarget, setDeleteTarget] = useState<InputProfile | null>(null);
  const { presetTarget, setPresetTarget, cancelPreset, confirmPreset } = usePresetConfirm(ctrl);

  const handleTabChange = useCallback((id: string) => {
    const next = CONTROLS_TABS.find((t) => t.id === id);
    if (next) setTab(next.id as ControlsTab);
  }, []);
  const cancelDelete = useCallback(() => setDeleteTarget(null), []);
  const confirmDelete = useCallback(() => {
    if (deleteTarget) ctrl.remove(deleteTarget);
    setDeleteTarget(null);
  }, [ctrl, deleteTarget]);

  return (
    <Box className="controls-settings">
      <Box className="controls-settings__layout">
        <SearchAnchor anchor="input-profiles" className="controls-settings__anchor">
          <ProfilesPanel ctrl={ctrl} onDelete={setDeleteTarget} narrow={narrow} />
        </SearchAnchor>
        <SearchAnchor anchor="bindings" className="controls-settings__anchor controls-settings__anchor--main">
          <Box className="controls-settings__main">
            <Tabs tabs={CONTROLS_TABS} activeTab={tab} onTabChange={handleTabChange} />
            <ScrollArea className="controls-settings__body">
              {tab === 'controls' && <SnesBindingsTab ctrl={ctrl} onRebind={(button) => setListeningFor({ type: 'snes', button })} />}
              {tab === 'shortcuts' && <FunctionBindingsTab ctrl={ctrl} onRebind={(action) => setListeningFor({ type: 'function', action })} />}
              {tab === 'options' && <OptionsTab ctrl={ctrl} />}
            </ScrollArea>
          </Box>
        </SearchAnchor>
        <SearchAnchor anchor="devices" className="controls-settings__anchor">
          <DevicesPanel ctrl={ctrl} onApply={setPresetTarget} narrow={narrow} />
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
