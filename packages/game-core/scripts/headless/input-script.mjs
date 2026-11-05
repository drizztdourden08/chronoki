/* @layer tooling-scripts @kind logic */
const PAD_A = 256;
const PAD_START = 8;
const PRESS_FROM = 200;
const PRESS_EVERY = 40;
const PRESS_HELD = 4;

const inputAt = (frame) => {
  if (frame <= PRESS_FROM || frame % PRESS_EVERY >= PRESS_HELD) return 0;
  return frame % (PRESS_EVERY * 2) < PRESS_EVERY ? PAD_A : PAD_START;
};

export { inputAt };
