/* @layer shared-asset-extraction @kind types */

type HandlerLength = [number, number | null];
type Seen = [string, string, number];
type Walk = [number, number, number, number | null, Seen[]];

export type { HandlerLength, Seen, Walk };
