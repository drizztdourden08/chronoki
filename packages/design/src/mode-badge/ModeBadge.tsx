/* @layer renderer-components @kind component */
import { Badge } from '@drizztdourden08/tessera/primitives';
import type { ModeBadgeProps } from './ModeBadge.type';

const ModeBadge = ({ mode, className }: ModeBadgeProps) => {
  if (mode === 'original') {
    return <Badge variant="inline" value="Original" color="tame" label="Original mode: Chrono Trigger as released" className={className} />;
  }
  return <Badge variant="inline" value="Modified" color="primary" label="Modified mode: enhancements are on" className={className} />;
};

export { ModeBadge };
