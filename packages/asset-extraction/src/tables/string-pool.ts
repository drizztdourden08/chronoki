/* @layer shared-asset-extraction @kind logic */
interface StringPool {
  /** The offset of the string in the pool, added (NUL-terminated) the first time. */
  add: (text: Uint8Array) => number;
  bytes: () => Uint8Array;
}

const keyOf = (text: Uint8Array): string => Array.from(text, (b) => b.toString(16).padStart(2, '0')).join('');

/** pack_tables.py Pool: each distinct string once, NUL-terminated, addressed by its offset. */
const createStringPool = (): StringPool => {
  const data: number[] = [];
  const at = new Map<string, number>();
  return {
    add: (text) => {
      const key = keyOf(text);
      const known = at.get(key);
      if (known !== undefined) return known;
      const offset = data.length;
      at.set(key, offset);
      data.push(...text, 0);
      return offset;
    },
    bytes: () => Uint8Array.from(data),
  };
};

export { createStringPool };
export type { StringPool };
