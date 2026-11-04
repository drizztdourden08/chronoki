/* @layer renderer-components @kind types */
type SettingFormat = (value: unknown) => string;

interface SettingsKey {
  key: string;
  label: string;
  format?: SettingFormat;
}

interface SettingsSection {
  title: string;
  keys: SettingsKey[];
}

export type { SettingFormat, SettingsKey, SettingsSection };
