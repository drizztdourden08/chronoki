/* @layer renderer-app @kind component */
import { Box, Button, Text } from '@drizztdourden08/tessera/primitives';
import { detectedPackLine } from './detected-pack-line';
import type { DetectedPackSummaryProps } from './detected-pack.type';

const DetectedPackSummary = ({ pack, onOpenProfiles }: DetectedPackSummaryProps) => (
  <Box>
    <Text as="span">{detectedPackLine(pack)}</Text>
    <Button variant="ghost" size="sm" onClick={onOpenProfiles}>Profiles</Button>
  </Box>
);

export { DetectedPackSummary };
