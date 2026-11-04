/* @layer renderer-components @kind logic */
import { PRESET_OPTIONS } from '@app/profiles/presets';
import type { ProfilePresetId } from '@app/profiles/presets';

const presetLabelOf = (preset: ProfilePresetId): string => PRESET_OPTIONS.find((option) => option.value === preset)?.label ?? preset;

export { presetLabelOf };
