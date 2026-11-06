/* @layer renderer-app @kind component */
import { useRef, useState } from 'react';
import { Box, ColorSwatch } from '@drizztdourden08/tessera/primitives';
import { ColorPickerPopover } from '@drizztdourden08/tessera/composites/ColorPickerPopover';
import type { HighlightColorControlProps } from './highlight.type';

const HighlightColorControl = ({ settingKey, settings, onChange }: HighlightColorControlProps) => {
  const anchorRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const value = settings[settingKey];
  return (
    <Box as="span" ref={anchorRef}>
      <ColorSwatch color={value} aria-label="Pick a colour" aria-expanded={open} onClick={() => setOpen(!open)} />
      <ColorPickerPopover
        open={open}
        anchorRef={anchorRef}
        value={value}
        onChange={(next: string) => onChange({ [settingKey]: next })}
        onClose={() => setOpen(false)}
        disableAlpha
      />
    </Box>
  );
};

export { HighlightColorControl };
