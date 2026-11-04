/* @layer shared-asset-extraction @kind types */
import type { Margin } from './steam-margins.type';
import type { Rgba } from './steam-image.type';

type ResolvedMargin = Omit<Margin, 'pages'> & { pages: [number, number][] };

interface CtWide {
  margins: Map<number, ResolvedMargin>;
  sets: Map<number, Uint8Array>;
  sheets: Uint8Array[];
  specials: (Rgba & { name: string })[];
  palettes: Map<number, Uint8Array>;
}

export type { ResolvedMargin, CtWide };
