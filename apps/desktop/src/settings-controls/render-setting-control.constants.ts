/* @layer renderer-app @kind data */
import type { ComponentType } from 'react';
import { TurboSpeedControl } from './TurboSpeedControl';
import { RenderScaleControl } from './RenderScaleControl';
import { DetectedPackControl } from './detected-pack-control';
import { DialogHoldSpeedControl } from './dialog/DialogHoldSpeedControl';
import { DialogSpeedControl } from './dialog/DialogSpeedControl';
import { AspectRatioRow } from './display/AspectRatioRow';
import type { SettingControlProps } from './settings-controls.type';

const CONTROL_OF_KEY: Readonly<Record<string, ComponentType<SettingControlProps>>> = {
  aspectRatio: AspectRatioRow,
  renderScale: RenderScaleControl,
  turboSpeed: TurboSpeedControl,
  dialogSpeed: DialogSpeedControl,
  dialogHoldSpeed: DialogHoldSpeedControl,
  detectedPack: DetectedPackControl,
};

export { CONTROL_OF_KEY };
