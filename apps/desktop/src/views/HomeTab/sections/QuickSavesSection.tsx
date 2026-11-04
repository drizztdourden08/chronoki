/* @layer renderer-components @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { SaveSlot } from '@app/compounds/SaveSlot';
import { useQuickSaves } from '../behavior/useQuickSaves';
import type { HomeSectionProps } from '../HomeTab.type';

const QuickSavesSection = ({ profileId, running }: HomeSectionProps) => {
  const { slots, busySlot, save, load } = useQuickSaves(profileId, running);
  return (
    <Box as="section" className="home-tab__section">
      <Text as="h3" className="home-tab__section-title">Quick Saves</Text>
      <Box className="home-tab__save-grid">
        {slots.map((info) => (
          <SaveSlot
            key={info.slot}
            slot={info.slot}
            screenshotUrl={info.screenshot}
            timestamp={info.savedAt ?? 0}
            isEmpty={info.savedAt === null}
            busy={busySlot === info.slot}
            disableSave={!running}
            disableLoad={!running}
            onSave={(slot) => void save(slot)}
            onLoad={(slot) => void load(slot)}
          />
        ))}
      </Box>
    </Box>
  );
};

export { QuickSavesSection };
