/* @layer renderer-components @kind logic */
import { formatDate } from '@drizztdourden08/tessera/primitives';
import type { ProfileFactsInput } from '../HomeTab.type';

const agoOf = (timestamp: number | undefined): string => (timestamp ? formatDate(timestamp, 'relative') : 'Never');

const buildProfileFacts = ({ romFile, lastPlayed, created }: ProfileFactsInput) => [[
  { label: 'ROM', value: (romFile ?? 'No ROM selected').replace(/\.(sfc|smc)$/i, ''), title: romFile ?? undefined },
  { label: 'Last played', value: agoOf(lastPlayed) },
  { label: 'Created', value: agoOf(created) },
]];

export { buildProfileFacts };
