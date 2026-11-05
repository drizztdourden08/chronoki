/* @layer renderer-lib @kind logic */
import type { PendulumImage } from './title-pendulum.type';

const encodePng = async (image: PendulumImage): Promise<Uint8Array | null> => {
  if (typeof OffscreenCanvas === 'undefined') return null;
  const canvas = new OffscreenCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.putImageData(new ImageData(image.rgba, image.width, image.height), 0, 0);
  const blob = await canvas.convertToBlob({ type: 'image/png' });
  return new Uint8Array(await blob.arrayBuffer());
};

export { encodePng };
