/* @layer renderer-components @kind types */
import type { useRomExtraction } from '../behavior/useRomExtraction';

interface ExtractionOptionsProps {
  extraction: ReturnType<typeof useRomExtraction>;
}

export type { ExtractionOptionsProps };
