/* @layer renderer-components @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import type { ProfileData } from '@app/storage/profile-data-store';

const buildControlFacts = ({ inputProfiles, activeInputProfileId }: ProfileData): FactsPanelFact[] => {
  const active = inputProfiles.find((input) => input.id === activeInputProfileId);
  return [
    { label: 'Controller profiles', value: String(inputProfiles.length) },
    { label: 'In use', value: active?.name ?? 'Default' },
  ];
};

export { buildControlFacts };
