/* @layer renderer-components @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { SaveSlot } from '@app/compounds/SaveSlot';
import { shortcutLabel } from './behavior/shortcut-label';
import { useSaveSlots } from './behavior/useSaveSlots';
import { useSlotActions } from './behavior/useSlotActions';
import { useSlotTrack } from './behavior/useSlotTrack';
import { OverlayHints } from './sub-components/OverlayHints';
import './SaveStateOverlay.css';
import type { SaveStateOverlayProps } from './SaveStateOverlay.type';
import { SLOT_COUNT } from './SaveStateOverlay.constants';

const SaveStateOverlay = (props: SaveStateOverlayProps) => {
  const { open, onClose, profileId, highlightedSlot, holdProgress, hints } = props;
  const { slots, visible, animating, loadSlots } = useSaveSlots(open, profileId);
  const { busy, handleSave, handleLoad } = useSlotActions(loadSlots, onClose);
  const { trackRef, highlightedRef } = useSlotTrack({ visible, highlightedSlot });

  if (!visible) return null;

  const panelClass = `save-overlay ${animating === 'in' ? 'save-overlay--enter' : ''} ${animating === 'out' ? 'save-overlay--exit' : ''}`;

  const showHints = highlightedSlot != null && hints != null && hints.length > 0;

  return (
    <Box className="save-overlay-backdrop" onClick={onClose}>
      <Box className={panelClass} onClick={(e) => e.stopPropagation()}>
        <Box ref={trackRef} className="save-overlay__track">
          {Array.from({ length: SLOT_COUNT }, (_, i) => {
            const slot = slots.find((s) => s.slot === i);
            const isEmpty = !slot || slot.savedAt === null;
            const isHighlighted = highlightedSlot === i;

            return (
              <Box
                key={i}
                className="save-overlay__slot-wrapper"
                ref={isHighlighted ? highlightedRef : undefined}
              >
                <SaveSlot
                  slot={i}
                  screenshotUrl={slot?.screenshot ?? null}
                  timestamp={slot?.savedAt ?? 0}
                  isEmpty={isEmpty}
                  busy={busy === i}
                  shortcutKey={shortcutLabel(i)}
                  highlighted={isHighlighted}
                  holdProgress={isHighlighted ? holdProgress : undefined}
                  onSave={handleSave}
                  onLoad={handleLoad}
                />
              </Box>
            );
          })}
        </Box>

        {showHints && <OverlayHints hints={hints} holdProgress={holdProgress} />}
      </Box>
    </Box>
  );
};

export { SaveStateOverlay };
