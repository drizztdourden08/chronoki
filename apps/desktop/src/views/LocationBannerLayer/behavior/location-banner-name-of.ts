/* @layer renderer-components @kind logic */
import { REGION_NAME_OF_MAP } from '../LocationBannerLayer.constants';

const locationBannerNameOf = (location: number | null): string | null =>
  location === null ? null : (REGION_NAME_OF_MAP.get(location) ?? null);

export { locationBannerNameOf };
