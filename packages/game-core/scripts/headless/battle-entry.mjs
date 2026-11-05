/* @layer tooling-scripts @kind logic */
// Guardia Forest (loc 0x13): from tile (9,38) a held LEFT walks into the Hetake pack obj21-23, the map's own ambush
// script runs and its op 0xD8 starts a 3x Hetake battle (Belthasar notes battle_dissolve.md part 3). Test-only: the
// Epoch Fail start warp is pointed there; no engine behaviour changes.
const FOREST_AMBUSH = { location: 0x13, x: 9, y: 38 };
const PAD_LEFT = 64;
const SETTLE_FRAMES = 120;
const WALK_FRAMES = 40;
const NO_ENEMY = 0xff;

const pointWarpAtForest = (warp) => Object.assign(warp, FOREST_AMBUSH);

const onForest = (ram) => ram.word(0x7e0100) === FOREST_AMBUSH.location;

const walkInput = (framesOnMap) => (framesOnMap >= SETTLE_FRAMES && framesOnMap < SETTLE_FRAMES + WALK_FRAMES ? PAD_LEFT : 0);

const readyToWalk = (framesOnMap) => framesOnMap === SETTLE_FRAMES;

const battleStaged = (ram) => {
  const first = ram.byte(0x7eaf0d);
  return first !== NO_ENEMY && first !== 0 && (ram.byte(0x7e0117) & 1) === 1;
};

const battleRunning = (ram) => (ram.byte(0x7e0117) & 1) === 1;

export { FOREST_AMBUSH, battleRunning, battleStaged, onForest, pointWarpAtForest, readyToWalk, walkInput };
