/* @layer renderer-components @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import { formatDate } from '@drizztdourden08/tessera/primitives';
import { formatBytes } from '@drizztdourden08/brock-core';
import type { ProfileData } from '@app/storage/profile-data-store';

const minutesOf = (ms: number): string => `${Math.max(1, Math.round(ms / 60000))} min`;

const buildSaveFacts = ({ saveFiles, saveBytes, sramBytes }: ProfileData): FactsPanelFact[] => [
  { label: 'Save files', value: String(saveFiles) },
  { label: 'Battery save', value: sramBytes === null ? 'None' : formatBytes(sramBytes) },
  { label: 'Save data size', value: formatBytes(saveBytes) },
];

const buildPlayFacts = ({ sessions }: ProfileData): FactsPanelFact[] => {
  const played = sessions.reduce((sum, session) => sum + session.durationMs, 0);
  const latest = sessions.reduce<number | null>((best, session) => (best === null || session.startedAt > best ? session.startedAt : best), null);
  return [
    { label: 'Sessions', value: String(sessions.length) },
    { label: 'Play time', value: sessions.length === 0 ? 'None yet' : minutesOf(played) },
    { label: 'Last session', value: latest === null ? 'Never' : formatDate(latest, 'datetime') },
  ];
};

export { buildPlayFacts, buildSaveFacts };
