/* @layer renderer-app @kind component */
import { useCallback } from 'react';
import { useProfilesStore } from '@drizztdourden08/brock-react';
import { useOnlineConnection } from '@drizztdourden08/brock-randomizer/renderer';
import { Toggle } from '@drizztdourden08/tessera/primitives';
import { SESSION_SWITCHES } from './online.constants';
import type { OnlineSessionToggleProps, SessionSwitch } from './online.type';

const OnlineSessionToggle = ({ settingKey }: OnlineSessionToggleProps) => {
  const { connection, patch } = useOnlineConnection();
  const hasConnection = useProfilesStore((state) => state.active?.randomizer !== undefined);
  const entry: SessionSwitch = SESSION_SWITCHES[settingKey] ?? { field: 'deathLink', fallback: false };
  const { field, fallback } = entry;
  const handleChange = useCallback((value: boolean) => void patch({ [field]: value }), [field, patch]);
  return <Toggle checked={connection[field] ?? fallback} disabled={!hasConnection} onChange={handleChange} />;
};

export { OnlineSessionToggle };
