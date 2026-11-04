/* @layer bridge-wasm @kind logic */
const turboState: { held: boolean; muted: boolean; volume: number; extraFrames: number } = {
  held: false,
  muted: false,
  volume: 100,
  extraFrames: 0,
};

export { turboState };
