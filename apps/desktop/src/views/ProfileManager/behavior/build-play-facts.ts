/* @layer renderer-components @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import { formatDate } from '@drizztdourden08/tessera/primitives';
import type { ProfileData } from '@app/storage/profile-data-store';
import { minutesOf } from './minutes-of';

const buildPlayFacts = ({ sessions }: ProfileData): FactsPanelFact[] => {
  const played = sessions.reduce((sum, session) => sum + session.durationMs, 0);
  const latest = sessions.reduce<number | null>((best, session) => (best === null || session.startedAt > best ? session.startedAt : best), null);
  return [
    { label: 'Sessions', value: String(sessions.length) },
    { label: 'Play time', value: sessions.length === 0 ? 'None yet' : minutesOf(played) },
    { label: 'Last session', value: latest === null ? 'Never' : formatDate(latest, 'datetime') },
  ];
};

export { buildPlayFacts };
