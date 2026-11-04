/* @layer bridge-wasm @kind logic */
import type { CoreCalls } from '@drizztdourden08/brock-port-kit';
import { CK_EXPORT_SET_VOICE_GAINS, GAIN_SILENT, GAIN_UNITY } from './msu-bridge.constants';

const setVoiceGains = (calls: CoreCalls, packPlaying: boolean): void => {
  if (!calls.has(CK_EXPORT_SET_VOICE_GAINS)) return;
  calls.call(CK_EXPORT_SET_VOICE_GAINS, packPlaying ? GAIN_SILENT : GAIN_UNITY, GAIN_UNITY);
};

export { setVoiceGains };
