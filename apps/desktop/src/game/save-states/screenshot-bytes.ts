/* @layer bridge-wasm @kind logic */
import { captureFrame } from '@drizztdourden08/brock-port-kit/renderer';

const screenshotBytes = async (canvas: HTMLCanvasElement): Promise<Uint8Array | null> => {
  try {
    const blob = await captureFrame(canvas);
    return blob ? new Uint8Array(await blob.arrayBuffer()) : null;
  } catch {
    return null;
  }
};

export { screenshotBytes };
