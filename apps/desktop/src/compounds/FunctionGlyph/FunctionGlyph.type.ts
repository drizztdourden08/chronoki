/* @layer renderer-components @kind types */
import type { FunctionAction } from '@chronoki/input-mapping';

interface FunctionGlyphProps {
  action: FunctionAction;
  size?: 'sm' | 'md';
  fallbackVariant?: 'key' | 'plain';
  className?: string;
}

export type { FunctionGlyphProps };
