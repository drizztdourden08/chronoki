/* @layer renderer-components @kind types */
type DockEdgeName = 'top' | 'right' | 'bottom' | 'left';

type DockBleed = Record<DockEdgeName, number>;

type EdgeRect = Pick<DOMRectReadOnly, DockEdgeName>;

export type { DockBleed, DockEdgeName, EdgeRect };
