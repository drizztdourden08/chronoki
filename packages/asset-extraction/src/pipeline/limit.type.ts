/* @layer shared-asset-extraction @kind types */
type Limiter = <T>(task: () => Promise<T>) => Promise<T>;

export type { Limiter };
