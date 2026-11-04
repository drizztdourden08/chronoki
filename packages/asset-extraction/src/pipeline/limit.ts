/* @layer shared-asset-extraction @kind logic */
type Limiter = <T>(task: () => Promise<T>) => Promise<T>;

const createLimiter = (max: number): Limiter => {
  const waiting: (() => void)[] = [];
  let running = 0;
  const release = (): void => {
    running -= 1;
    waiting.shift()?.();
  };
  return async <T>(task: () => Promise<T>): Promise<T> => {
    if (running >= Math.max(1, max)) await new Promise<void>((resolve) => waiting.push(resolve));
    running += 1;
    try {
      return await task();
    } finally {
      release();
    }
  };
};

export { createLimiter };
export type { Limiter };
