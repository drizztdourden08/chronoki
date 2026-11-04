/* @layer renderer-app @kind component */
import { AspectRatioControl } from '@drizztdourden08/brock-display/renderer';
import { Box, Small } from '@drizztdourden08/tessera/primitives';
import { effectiveGatesOf } from '../effective-gates-of';
import { isSettingDisabled } from '../is-setting-disabled';
import type { SettingControlProps } from '../settings-controls.type';
import { aspectChangePatch } from './aspect-change-patch';
import { aspectChoices } from './aspect-choices';
import {
  ASPECT_DESCRIPTIONS, ASPECT_LIMITS, ASPECT_LOCKED_MESSAGE, ASPECT_RECOMMENDED_NOTE, ASPECT_VANILLA_LOCKED_MESSAGE, LETTERBOX_NOTE,
} from './display.constants';
import { isLetterboxed } from './letterboxed-ratio';
import './AspectRatioRow.css';

const lockedMessageOf = (vanillaSafe: boolean): string => (vanillaSafe ? ASPECT_VANILLA_LOCKED_MESSAGE : ASPECT_LOCKED_MESSAGE);

const AspectRatioRow = ({ settings, onChange }: SettingControlProps) => {
  const locked = isSettingDisabled('aspectRatio', settings);
  const { options, widePresets, tallPresets } = aspectChoices(effectiveGatesOf(settings).has('tallRendering'));
  const showLetterbox = !locked && isLetterboxed(settings);
  return (
    <Box className={locked ? 'aspect-ratio-row aspect-ratio-row--locked' : 'aspect-ratio-row'} aria-disabled={locked}>
      <AspectRatioControl
        label="Aspect Ratio"
        description={locked ? lockedMessageOf(settings.vanillaSafe) : undefined}
        value={settings.aspectRatio}
        options={options}
        widePresets={widePresets}
        tallPresets={tallPresets}
        descriptions={locked ? {} : ASPECT_DESCRIPTIONS}
        recommendedValue="auto"
        recommendedNote={ASPECT_RECOMMENDED_NOTE}
        customW={settings.customAspectW}
        customH={settings.customAspectH}
        limits={ASPECT_LIMITS}
        letterbox
        onChange={(change) => {
          if (!locked) onChange(aspectChangePatch(change));
        }}
      />
      {showLetterbox && <Small tone="dim">{LETTERBOX_NOTE}</Small>}
    </Box>
  );
};

export { AspectRatioRow };
