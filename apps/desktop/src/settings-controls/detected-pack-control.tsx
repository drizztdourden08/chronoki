/* @layer renderer-app @kind component */
import { DetectedPackSummary } from './audio/DetectedPackSummary';
import { openProfilesPage } from './audio/open-profiles-page';
import { useActiveMsuPack } from './audio/useActiveMsuPack';

const DetectedPackControl = () => <DetectedPackSummary pack={useActiveMsuPack()} onOpenProfiles={openProfilesPage} />;

export { DetectedPackControl };
