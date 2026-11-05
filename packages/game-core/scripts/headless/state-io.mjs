/* @layer tooling-scripts @kind logic */
import { stepFrame } from './boot.mjs';

const PENDING = 1;
const OK = 2;
const WAIT_LIMIT = 600;

const settle = async (engine) => {
  for (let i = 0; i < WAIT_LIMIT && engine.core._CkStateStatus() === PENDING; i++) await stepFrame(engine, 0);
  const status = engine.core._CkStateStatus();
  if (status !== OK) throw new Error(`state request refused: status ${status} reason ${engine.core._CkStateReason()}`);
};

const saveState = async (engine) => {
  engine.core._CkStateSave();
  await settle(engine);
  const { core } = engine;
  return new Uint8Array(core.HEAPU8.buffer, core._CkStateBuffer(), core._CkStateSize()).slice();
};

const loadState = async (engine, bytes) => {
  const { core } = engine;
  const at = core._CkStateInput(bytes.length);
  core.HEAPU8.set(bytes, at);
  core._CkStateLoad(at, bytes.length);
  await settle(engine);
};

export { loadState, saveState };
