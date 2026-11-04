/* @layer renderer-components @kind component */
import { resolveFunctionMappingIcon } from '@chronoki/input-mapping';
import { InputGlyph } from '@app/compounds/InputGlyph';
import { getInputManager } from '@app/input/input-manager/get-input-manager';
import type { FunctionGlyphProps } from './FunctionGlyph.type';

const FunctionGlyph = ({ action, size, fallbackVariant, className }: FunctionGlyphProps) => {
  const mapping = getInputManager().getFunctionMappings().find((entry) => entry.action === action);
  if (!mapping || mapping.binding.type === 'none') return null;
  return (
    <InputGlyph
      binding={mapping.binding}
      icon={resolveFunctionMappingIcon(mapping)}
      showLabel={false}
      size={size}
      fallbackVariant={fallbackVariant}
      fallbackClassName={className}
    />
  );
};

export { FunctionGlyph };
