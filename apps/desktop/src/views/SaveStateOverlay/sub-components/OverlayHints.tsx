/* @layer renderer-components @kind component */
import { Box, ProgressRing, Text } from '@drizztdourden08/tessera/primitives';
import { FunctionGlyph } from '@app/compounds/FunctionGlyph';
import { slotFunctionOf } from '../behavior/slot-function-of';
import { HINT_LABELS } from '../SaveStateOverlay.constants';
import type { OverlayHintsProps } from '../SaveStateOverlay.type';

const OverlayHints = ({ actions, slot, holdProgress }: OverlayHintsProps) => (
  <Box className="save-overlay__hints">
    {actions.map((action) => (
      <Box key={action} className={`save-overlay__hint save-overlay__hint--${action}`}>
        <Box className="save-overlay__hint-icon-wrap">
          <FunctionGlyph
            action={action === 'esc-cancel' ? 'menu' : slotFunctionOf(slot)}
            size="sm"
            fallbackVariant="plain"
            className="save-overlay__hint-key-text"
          />
          {(action === 'hold-save' || action === 'holding-save') && (
            <ProgressRing
              className="save-overlay__hint-ring"
              progress={action === 'holding-save' ? holdProgress : undefined}
            />
          )}
        </Box>
        <Text className="save-overlay__hint-label">{HINT_LABELS[action]}</Text>
      </Box>
    ))}
  </Box>
);

export { OverlayHints };
