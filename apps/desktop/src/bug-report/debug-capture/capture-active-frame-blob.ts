/* @layer renderer-lib @kind logic */
import { captureGameFrame } from '@app/game/frame-capture';
import { activeGameHolder } from '@app/game/lifecycle';

const captureActiveFrameBlob = async (): Promise<Blob | null> => {
  const game = activeGameHolder.current;
  if (!game) return null;
  try {
    return await captureGameFrame(game.canvas);
  } catch {
    return null;
  }
};

export { captureActiveFrameBlob };
