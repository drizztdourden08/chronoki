/* @layer renderer-lib @kind logic */
import { PNG_HEIGHT_AT, PNG_WIDTH_AT } from './title-pendulum.constants';

const pngSize = (png: Uint8Array): { width: number; height: number } | null => {
  if (png.length < PNG_HEIGHT_AT + 4) return null;
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  const size = { width: view.getUint32(PNG_WIDTH_AT), height: view.getUint32(PNG_HEIGHT_AT) };
  return size.width > 0 && size.height > 0 ? size : null;
};

export { pngSize };
