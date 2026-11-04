/* @layer renderer-components @kind types */
interface StoredFold {
  collapsed: boolean;
  setCollapsed: (next: boolean) => void;
  expand: () => void;
}

export type { StoredFold };
