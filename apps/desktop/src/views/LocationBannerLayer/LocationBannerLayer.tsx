/* @layer renderer-components @kind component */
import { LocationBanner } from '@drizztdourden08/brock-port-kit/renderer';
import { useGameSession } from '@app/views/GameSession';
import { locationBannerNameOf } from './behavior/location-banner-name-of';
import { useCurrentLocation } from './behavior/useCurrentLocation';
import { LOCATION_BANNER_GATE } from './LocationBannerLayer.constants';

const LocationBannerLayer = () => {
  const { gates } = useGameSession();
  const enabled = gates.has(LOCATION_BANNER_GATE);
  const location = useCurrentLocation(enabled);
  if (!enabled) return null;
  return <LocationBanner location={location} locationNameOf={locationBannerNameOf} />;
};

export { LocationBannerLayer };
