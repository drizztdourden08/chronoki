/* @layer renderer-appshell @kind hook */
import { useEffect } from 'react';
import { useSettings } from '@drizztdourden08/brock-react';
import { setHostGates, setLiveSettings } from '@chronoki/game-core';
import { pushLiveSettings } from '@app/game/live-settings/push-live-settings';
import { setAudioOutput, setAudioSamples } from '@app/game/audio-lead';
import { applyFrameSchedule } from '@app/game/frame-schedule';
import { setAutoSaveInterval, setAutoSaveMaxEntries } from '@app/game/auto-save';
import { setTurboSpeed, setTurboVolume } from '@app/game/turbo';
import { applyLiveVolume } from '@app/game/turbo/apply-live-volume';
import type { AppSettings } from '@app/settings.type';
import type { useCoreSettings } from './useCoreSettings';

const useHostFeatures = ({ settings, gates, volume, autoSaveIntervalSeconds, autoSaveMaxEntries, turboSpeed }: ReturnType<typeof useCoreSettings>): void => {
  const { settings: app } = useSettings<AppSettings>();
  const { audioSamples, audioFreq, audioChannels, vsync } = app;
  useEffect(() => { setAudioSamples(audioSamples); }, [audioSamples]);
  useEffect(() => { setAudioOutput(audioFreq, audioChannels); }, [audioFreq, audioChannels]);
  useEffect(() => { applyFrameSchedule(vsync); }, [vsync]);
  useEffect(() => { setHostGates(gates); }, [gates]);
  const { baseQ4, holdQ4, hold, fill } = settings.dialogPacing;
  useEffect(() => {
    setLiveSettings({ dimFlashes: gates.has('dimFlashes'), dialogPacing: { baseQ4, holdQ4, hold, fill } });
    pushLiveSettings();
  }, [gates, baseQ4, holdQ4, hold, fill]);
  useEffect(() => { setAutoSaveInterval(autoSaveIntervalSeconds); }, [autoSaveIntervalSeconds]);
  useEffect(() => { setAutoSaveMaxEntries(autoSaveMaxEntries); }, [autoSaveMaxEntries]);
  useEffect(() => { setTurboSpeed(turboSpeed); }, [turboSpeed]);
  useEffect(() => { setTurboVolume(volume); applyLiveVolume(volume); }, [volume]);
};

export { useHostFeatures };
