/* @layer shared @kind types */
type AspectRatioChoice = 'original' | 'auto' | 'screen' | '4:3' | '16:10' | '16:9' | '21:9' | '4:5' | '3:4' | 'custom';

type RenderScaleFactor = 2 | 3 | 4;

interface GateOptions {
  aspectRatio: AspectRatioChoice;
  customAspectW: number;
  customAspectH: number;
  renderScale: RenderScaleFactor;
  screenRatio?: number;
}

export type { AspectRatioChoice, GateOptions, RenderScaleFactor };
