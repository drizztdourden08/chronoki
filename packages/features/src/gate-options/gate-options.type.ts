/* @layer shared @kind types */
type AspectRatioChoice = 'original' | 'auto' | 'screen' | '4:3' | '16:10' | '16:9' | '21:9' | '4:5' | '3:4' | 'custom';

type RenderScaleFactor = 2 | 3 | 4;

interface PixelArea {
  width: number;
  height: number;
}

interface GateOptions {
  aspectRatio: AspectRatioChoice;
  customAspectW: number;
  customAspectH: number;
  renderScale: RenderScaleFactor;
  screenRatio?: number;
  stageArea?: PixelArea;
  wholePixels?: boolean;
}

export type { AspectRatioChoice, GateOptions, PixelArea, RenderScaleFactor };
