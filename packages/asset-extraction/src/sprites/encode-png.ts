/* @layer shared-asset-extraction @kind logic */
import type { RgbaImage } from './party-sprites.type';

const encodePng = async (image: RgbaImage): Promise<Uint8Array> => {
  if (typeof OffscreenCanvas === 'undefined') throw new Error('OffscreenCanvas is not available');
  const canvas = new OffscreenCanvas(Math.max(1, image.width), Math.max(1, image.height));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('2d canvas context unavailable');
  if (image.width > 0 && image.height > 0) {
    context.putImageData(new ImageData(Uint8ClampedArray.from(image.rgba), image.width, image.height), 0, 0);
  }
  const blob = await canvas.convertToBlob({ type: 'image/png' });
  return new Uint8Array(await blob.arrayBuffer());
};

export { encodePng };
