/* @layer bridge-wasm @kind logic */
import { activeGameHolder } from '../lifecycle/active-game-holder';

const keepAudioRunning = (): void => {
  const context = activeGameHolder.current?.session.audio.output()?.context;
  if (context?.state === 'suspended') void context.resume().catch(() => undefined);
};

export { keepAudioRunning };
