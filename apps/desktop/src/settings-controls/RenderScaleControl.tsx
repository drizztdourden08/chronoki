/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera/primitives';
import type { RenderScaleFactor } from '@chronoki/features';
import { RENDER_SCALE_OPTIONS } from './render-scale-options.constants';
import type { RenderScaleControlProps } from './settings-controls.type';

const RenderScaleControl = ({ settings, onChange }: RenderScaleControlProps) => (
  <SegmentedControl
    value={String(settings.renderScale)}
    options={RENDER_SCALE_OPTIONS}
    onChange={(value) => onChange({ renderScale: Number(value) as RenderScaleFactor })}
  />
);

export { RenderScaleControl };
