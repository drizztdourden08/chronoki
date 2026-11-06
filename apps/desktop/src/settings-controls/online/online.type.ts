/* @layer renderer-app @kind types */
interface SessionSwitch {
  field: 'deathLink' | 'trackOtherPlayers';
  fallback: boolean;
}

interface OnlineSessionToggleProps {
  settingKey: string;
}

export type { OnlineSessionToggleProps, SessionSwitch };
