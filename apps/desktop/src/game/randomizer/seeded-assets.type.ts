/* @layer bridge-wasm @kind type */
type SeededAssets = { ok: true; assets: Uint8Array } | { ok: false; reason: string };

export type { SeededAssets };
