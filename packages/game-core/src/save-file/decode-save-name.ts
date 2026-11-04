/* @layer bridge-wasm @kind logic */
import {
  NAME_APOSTROPHE, NAME_LOWER_FIRST, NAME_LOWER_LAST, NAME_PADS, NAME_PERIOD, NAME_UPPER_FIRST, NAME_UPPER_LAST,
  NAME_DIGIT_FIRST, NAME_DIGIT_LAST,
} from './save-file.constants';

const letterOf = (byte: number): string | null => {
  if (byte >= NAME_UPPER_FIRST && byte <= NAME_UPPER_LAST) return String.fromCharCode(65 + byte - NAME_UPPER_FIRST);
  if (byte >= NAME_LOWER_FIRST && byte <= NAME_LOWER_LAST) return String.fromCharCode(97 + byte - NAME_LOWER_FIRST);
  if (byte >= NAME_DIGIT_FIRST && byte <= NAME_DIGIT_LAST) return String.fromCharCode(48 + byte - NAME_DIGIT_FIRST);
  if (byte === NAME_APOSTROPHE) return "'";
  if (byte === NAME_PERIOD) return '.';
  return null;
};

const decodeSaveName = (bytes: Uint8Array): string | null => {
  let end = bytes.length;
  while (end > 0 && NAME_PADS.includes(bytes[end - 1])) end -= 1;
  const letters = Array.from(bytes.subarray(0, end), letterOf);
  if (letters.length === 0 || letters.includes(null)) return null;
  return letters.join('');
};

export { decodeSaveName };
