/* @layer shared-asset-extraction @kind logic */
interface StringPool {
  add: (text: Uint8Array) => number;
  bytes: () => Uint8Array;
}

const keyOf = (text: Uint8Array): string => Array.from(text, (b) => b.toString(16).padStart(2, '0')).join('');

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
