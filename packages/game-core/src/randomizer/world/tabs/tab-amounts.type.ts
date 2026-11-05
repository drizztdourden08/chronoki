/* @layer bridge-wasm @kind type */
type TabKind = 'power' | 'magic' | 'speed';

type TabAmounts = Readonly<Record<TabKind, number>>;

export type { TabAmounts, TabKind };
