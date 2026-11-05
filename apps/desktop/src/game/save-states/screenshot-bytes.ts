/* @layer bridge-wasm @kind logic */
import { captureGameFrame } from '../frame-capture';

const screenshotBytes = async (canvas: HTMLCanvasElement): Promise<Uint8Array | null> => {
  try {
    const blob = await captureGameFrame(canvas);
    return blob ? new Uint8Array(await blob.arrayBuffer()) : null;
  } catch {
    return null;
  }
};

export { screenshotBytes };
