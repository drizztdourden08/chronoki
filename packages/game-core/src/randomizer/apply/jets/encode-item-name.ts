/* @layer bridge-wasm @kind logic */
import { NAME_SPACE } from './jets-item.constants';

const byteOfChar = (char: string): number => {
  const code = char.charCodeAt(0);
  if (code >= 0x41 && code <= 0x5a) return 0xa0 + code - 0x41;
  if (code >= 0x61 && code <= 0x7a) return 0xba + code - 0x61;
  if (code >= 0x30 && code <= 0x39) return 0xd4 + code - 0x30;
  if (char === ' ') return NAME_SPACE;
  throw new RangeError(`item name character not encodable: ${char}`);
};

const encodeItemName = (name: string): number[] => Array.from(name, byteOfChar);

export { encodeItemName };
