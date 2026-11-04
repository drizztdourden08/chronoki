/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { Box, Icon, IconButton, Image, Text } from '@drizztdourden08/tessera/primitives';
import { getBindingLabel } from '@chronoki/input-mapping';
import { InputGlyph } from '@app/compounds/InputGlyph';
import type { BindingRowProps } from './controls.type';
import './BindingRow.css';

const BindingRow = ({ actionLabel, middleLabel, middleIconId, binding, icon, deviceIconSrc, onRebind, onClear }: BindingRowProps) => {
  const isNone = binding.type === 'none';

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onRebind();
    }
  }, [onRebind]);
  const handleClear = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    onClear();
  }, [onClear]);

  return (
    <Box className="binding-row" role="button" tabIndex={0} title={`Click to rebind ${actionLabel}`} onClick={onRebind} onKeyDown={handleKeyDown}>
      <Text className="binding-row__action-label">{actionLabel}</Text>
      <Box className="binding-row__rest">
        <Box className="binding-row__icon-slot">
          {middleIconId && <InputGlyph iconId={middleIconId} label={middleLabel} showLabel={false} />}
        </Box>
        <Text className="binding-row__snes-label">{middleLabel ?? ''}</Text>
        <Box className="binding-row__icon-slot">
          {!isNone && <InputGlyph binding={binding} icon={icon} showLabel={false} />}
        </Box>
        <Box className="binding-row__icon-slot">
          {!isNone && deviceIconSrc && <Image src={deviceIconSrc} alt="" className="binding-row__device-icon" />}
        </Box>
        <Text className={`binding-row__binding-label ${isNone ? 'binding-row__binding-label--none' : ''}`}>
          {getBindingLabel(binding, icon)}
        </Text>
        {!isNone && (
          <IconButton variant="ghost" tone="danger" size="xs" className="binding-row__clear" label="Clear binding" onClick={handleClear}>
            <Icon name="x" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export { BindingRow };
