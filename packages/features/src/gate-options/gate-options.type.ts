/* @layer shared @kind types */
type WideAspect = '16:9' | '16:10' | '21:9';

type RenderScaleFactor = 2 | 3 | 4;

interface GateOptions {
  widescreenAspect: WideAspect;
  renderScale: RenderScaleFactor;
}

export type { GateOptions, RenderScaleFactor, WideAspect };
