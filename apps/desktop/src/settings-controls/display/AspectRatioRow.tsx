/* @layer renderer-app @kind component */
import { AspectRatioControl } from '@drizztdourden08/brock-display/renderer';
import { effectiveGatesOf } from '../effective-gates-of';
import { isSettingDisabled } from '../is-setting-disabled';
import type { SettingControlProps } from '../settings-controls.type';
import { aspectChangePatch } from './aspect-change-patch';
import { aspectChoices } from './aspect-choices';
import {
  ASPECT_DESCRIPTIONS, ASPECT_LIMITS, ASPECT_LOCKED_MESSAGE, ASPECT_RECOMMENDED_NOTE, ASPECT_VANILLA_LOCKED_MESSAGE,
} from './display.constants';

const lockedMessageOf = (vanillaSafe: boolean): string => (vanillaSafe ? ASPECT_VANILLA_LOCKED_MESSAGE : ASPECT_LOCKED_MESSAGE);

const AspectRatioRow = ({ settings, onChange }: SettingControlProps) => {
  const locked = isSettingDisabled('aspectRatio', settings);
  const { options, widePresets, tallPresets } = aspectChoices(effectiveGatesOf(settings).has('tallRendering'));
  return (
    <AspectRatioControl
      label="Aspect Ratio"
      value={settings.aspectRatio}
      options={options}
      widePresets={widePresets}
      tallPresets={tallPresets}
      descriptions={ASPECT_DESCRIPTIONS}
      recommendedValue="auto"
      recommendedNote={ASPECT_RECOMMENDED_NOTE}
      customW={settings.customAspectW}
      customH={settings.customAspectH}
      limits={ASPECT_LIMITS}
      letterbox
      disabled={locked}
      lockedMessage={lockedMessageOf(settings.vanillaSafe)}
      onChange={(change) => {
        if (!locked) onChange(aspectChangePatch(change));
      }}
    />
  );
};

export { AspectRatioRow };
