/* @layer renderer-app @kind types */
import type { HIGHLIGHT_KEYS } from './highlight.constants';
import type { SettingControlProps } from '../settings-controls.type';

type HighlightKey = typeof HIGHLIGHT_KEYS[number];

interface HighlightColorControlProps extends SettingControlProps {
  settingKey: HighlightKey;
}

export type { HighlightColorControlProps, HighlightKey };
