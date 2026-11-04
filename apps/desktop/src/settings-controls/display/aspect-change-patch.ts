/* @layer renderer-app @kind logic */
import type { AspectRatioChange } from '@drizztdourden08/brock-display/renderer';
import type { AspectRatioChoice } from '@chronoki/features';
import type { AppSettings } from '@app/settings.type';

const aspectChangePatch = ({ value, customW, customH }: AspectRatioChange): Partial<AppSettings> => ({
  aspectRatio: value as AspectRatioChoice,
  ...(customW !== undefined ? { customAspectW: customW } : {}),
  ...(customH !== undefined ? { customAspectH: customH } : {}),
});

export { aspectChangePatch };
