/* @layer renderer-components @kind component */
import { useEffect } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { SaveSlot } from '@app/compounds/SaveSlot';
import { closeSaveOverlay } from '@app/game/save-overlay';
import { useGameSession } from '@app/views/GameSession';
import { useOverlaySlots } from './behavior/useOverlaySlots';
import { useSaveOverlay } from './behavior/useSaveOverlay';
import { shortcutLabel } from './behavior/shortcut-label';
import { useCancelOnOtherInput } from './behavior/useCancelOnOtherInput';
import { useOverlayPresence } from './behavior/useOverlayPresence';
import { HOLDING_HINTS, IDLE_HINTS } from './SaveStateOverlay.constants';
import { OverlayHints } from './sub-components/OverlayHints';
import './SaveStateOverlay.css';

const SaveStateOverlay = () => {
  const { open, slot: highlighted, holdProgress } = useSaveOverlay();
  const { launch, running } = useGameSession();
  const { slots, busySlot, save, load } = useOverlaySlots(open, launch?.profileId ?? null);

  useEffect(() => {
    if (!running) closeSaveOverlay();
  }, [running]);

  useCancelOnOtherInput(open, closeSaveOverlay);

  const { visible, exiting } = useOverlayPresence(open);
  if (!visible) return null;

  return (
    <Box className="save-overlay-backdrop" onClick={closeSaveOverlay}>
      <Box className={exiting ? 'save-overlay save-overlay--exit' : 'save-overlay'} onClick={(event) => event.stopPropagation()}>
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
                shortcutKey={shortcutLabel(info.slot)}
                holdProgress={info.slot === highlighted ? holdProgress : undefined}
                onSave={(target) => void save(target)}
                onLoad={(target) => void load(target)}
              />
            </Box>
          ))}
        </Box>
        {highlighted >= 0 && (
          <OverlayHints actions={holdProgress > 0 ? HOLDING_HINTS : IDLE_HINTS} slot={highlighted} holdProgress={holdProgress} />
        )}
      </Box>
    </Box>
  );
};

export { SaveStateOverlay };
