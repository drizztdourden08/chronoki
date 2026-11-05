/* @layer bridge-wasm @kind logic */
const turboState: { held: boolean; volume: number; extraFrames: number; fraction: number } = {
  held: false,
  volume: 100,
  extraFrames: 0,
  fraction: 0,
};

export { turboState };
