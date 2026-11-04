/* @layer renderer-components @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { PlaySessionCard } from '@app/compounds/PlaySessionCard';
import { usePlaySessions } from '../behavior/usePlaySessions';
import type { HomeSectionProps } from '../HomeTab.type';

const PlaySessionsSection = ({ profileId, running }: HomeSectionProps) => {
  const sessions = usePlaySessions(profileId, running);
  return (
    <Box as="section" className="home-tab__section">
      <Text as="h3" className="home-tab__section-title">Play Sessions</Text>
      {sessions.length === 0 ? (
        <Text as="p" className="home-tab__empty">No play sessions yet</Text>
      ) : (
        <Box className="home-tab__sessions">
          {sessions.map((session) => (
            <PlaySessionCard key={session.id} session={session} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export { PlaySessionsSection };
