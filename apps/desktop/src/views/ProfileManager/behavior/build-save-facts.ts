/* @layer renderer-components @kind logic */
import type { FactsPanelFact } from '@drizztdourden08/tessera/composites';
import { formatBytes } from '@drizztdourden08/brock-core';
import type { ProfileData } from '@app/storage/profile-data-store';

const buildSaveFacts = ({ saveFiles, saveBytes, sramBytes }: ProfileData): FactsPanelFact[] => [
  { label: 'Save files', value: String(saveFiles) },
  { label: 'Battery save', value: sramBytes === null ? 'None' : formatBytes(sramBytes) },
  { label: 'Save data size', value: formatBytes(saveBytes) },
];

export { buildSaveFacts };
