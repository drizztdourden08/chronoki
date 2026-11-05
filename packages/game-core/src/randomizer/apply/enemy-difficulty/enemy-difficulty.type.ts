/* @layer bridge-wasm @kind type */
type OptionBag = Readonly<Record<string, unknown>>;
type SphereLike = { index: number; locations: readonly unknown[] };

export type { OptionBag, SphereLike };
