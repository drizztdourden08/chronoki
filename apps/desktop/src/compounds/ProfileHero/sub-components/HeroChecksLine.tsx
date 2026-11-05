/* @layer renderer-components @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import type { HeroChecks } from '../ProfileHero.type';
import './HeroChecksLine.css';

const HeroChecksLine = ({ checks, label }: { checks: HeroChecks; label: string }) => (
  <Box className="hero-progress__checks" title={`${checks.total} checks in this seed`}>
    <Text className="hero-progress__file">{label}</Text>
    <Text as="span" className="hero-progress__count hero-progress__count--taken">{checks.taken} taken</Text>
    {checks.available !== null && <Text as="span" className="hero-progress__count hero-progress__count--available">{checks.available} available</Text>}
    <Text as="span" className="hero-progress__count">{checks.left} left</Text>
  </Box>
);

export { HeroChecksLine };
