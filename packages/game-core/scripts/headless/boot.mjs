import { createRequire } from 'node:module';
import { join } from 'node:path';

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

// Loads the wasm core with the seeded pack in memory and the randomizer switched on (same files the app writes).
const bootEngine = async (wasmDir, packBytes) => {
  const lines = [];
  const state = { stopped: null };
  const options = {
    print: (line) => lines.push(line),
    printErr: () => {},
    onExit: (code) => { state.stopped = code ?? 0; },
    onAbort: (why) => { state.stopped = `abort ${why}`; },
    preRun: [() => {
      options.FS.writeFile('/ct_assets.dat', packBytes);
      options.FS.writeFile('/ct_settings.ini', '[game]\nrandomizer = 1\n');
      options.FS.mkdir('/saves');
    }],
  };
  const core = await createRequire(import.meta.url)(join(wasmDir, 'chronoki.js'))(options);
  return { core, lines, state };
};

const stepFrame = async (engine, input) => {
  engine.core._CkSetInput(input);
  engine.core._CkRunFrame();
  await tick();
};

const lumaOf = (core) => {
  const ptr = core._CkFramePtr();
  const count = core._CkFrameWidth() * core._CkFrameHeight();
  const heap = core.HEAPU8;
  let sum = 0;
  for (let i = 0; i < count; i++) {
    const at = ptr + i * 4;
    sum += 0.299 * heap[at] + 0.587 * heap[at + 1] + 0.114 * heap[at + 2];
  }
  return count === 0 ? 0 : sum / count;
};

export { bootEngine, lumaOf, stepFrame };
