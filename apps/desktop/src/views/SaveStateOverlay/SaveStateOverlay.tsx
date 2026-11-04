/* @layer renderer-components @kind component */
import { useEffect } from 'react';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { SaveSlot } from '@app/compounds/SaveSlot';
import { closeSaveOverlay } from '@app/game/save-overlay';
import { useGameSession } from '@app/views/GameSession';
import { useOverlaySlots } from './behavior/useOverlaySlots';
import { useSaveOverlay } from './behavior/useSaveOverlay';
import { SAVE_OVERLAY_HINT } from './SaveStateOverlay.constants';
import './SaveStateOverlay.css';

const SaveStateOverlay = () => {
  const { open, slot: highlighted, holdProgress } = useSaveOverlay();
  const { launch, running } = useGameSession();
  const { slots, busySlot, save, load } = useOverlaySlots(open, launch?.profileId ?? null);

  useEffect(() => {
    if (!running) closeSaveOverlay();
  }, [running]);

  if (!open) return null;

  return (
    <Box className="save-overlay-backdrop" onClick={closeSaveOverlay}>
      <Box className="save-overlay" onClick={(event) => event.stopPropagation()}>
        <Box className="save-overlay__track">
          {slots.map((info) => (
            <Box
              key={info.slot}
              className="save-overlay__slot"
              ref={(element: HTMLDivElement | null) => {
                if (element && info.slot === highlighted) element.scrollIntoView({ inline: 'center', block: 'nearest' });
              }}
            >
              <SaveSlot
                slot={info.slot}
                screenshotUrl={info.screenshot}
                timestamp={info.savedAt ?? 0}
                isEmpty={info.savedAt === null}
                busy={busySlot === info.slot}
                highlighted={info.slot === highlighted}
                holdProgress={info.slot === highlighted ? holdProgress : undefined}
                onSave={(target) => void save(target)}
                onLoad={(target) => void load(target)}
              />
            </Box>
          ))}
        </Box>
        <Text className="save-overlay__hint">{SAVE_OVERLAY_HINT}</Text>
      </Box>
    </Box>
  );
};

export { SaveStateOverlay };
