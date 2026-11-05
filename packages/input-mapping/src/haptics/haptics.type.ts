/* @layer shared-input @kind types */
import type { VibrationSegment } from '@drizztdourden08/brock-input';
import type { HapticPatternId } from '../data/haptics';
import type { HapticSettings } from './haptic-settings.type';

type VibrateFunction = (pattern: VibrationSegment[], gapMs?: number, minDurationExempt?: boolean) => void;

type HapticRoute = {
  setting: 'damageTaken' | 'enemyDefeated';
  pattern: (param: number) => HapticPatternId | null;
};

interface HapticState {
  settings: HapticSettings;
  vibrateFn: VibrateFunction | null;
}

export type { HapticRoute, HapticState, VibrateFunction };
