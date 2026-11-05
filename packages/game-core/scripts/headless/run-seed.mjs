import { readFileSync } from 'node:fs';
import { bootEngine, lumaOf, stepFrame } from './boot.mjs';
import { flagChecks, goldCheck, maskCheck, notBlackCheck, rosterCheck } from './checks.mjs';
import { inputAt } from './input-script.mjs';
import { magicChecks } from './magic-checks.mjs';
import { ramReader } from './ram.mjs';

const AFTER_START_MIN = 360;
const POLL_EVERY = 30;
const SETTLE_EXTRA = 60;

const partyMatches = (ram, prepared) => rosterCheck(ram, prepared.partyIds).ok && maskCheck(ram, prepared.partyIds).ok;

// Boots the seeded pack, presses to a new game, applies the desktop's start grants, runs until the party landed.
const runSeed = async (mods, args, wasmDir) => {
  const { prepareSeedPack, createHeadlessGrants } = mods;
  const base = readFileSync(args.pack);
  const prepared = prepareSeedPack(new Uint8Array(base), args.options, args.party ?? mods.legacyParty, args.seed);
  const engine = await bootEngine(wasmDir, prepared.bytes);
  const { core, state } = engine;
  const ram = ramReader(core);
  const grants = createHeadlessGrants(args.options, {
    heap: () => core.HEAPU8, wramPtr: () => core._CkWramPtr(), isLive: () => state.stopped === null, onLoaded: () => () => {},
  });
  let startedAt = -1;
  let settledAt = -1;
  let frame = 0;
  for (; frame < args.frames && state.stopped === null; frame++) {
    await stepFrame(engine, inputAt(frame));
    grants.observe();
    if (startedAt < 0 && grants.started()) startedAt = frame;
    const waited = startedAt >= 0 && frame - startedAt >= AFTER_START_MIN && frame % POLL_EVERY === 0;
    if (settledAt < 0 && waited && partyMatches(ram, prepared)) settledAt = frame;
    if (settledAt >= 0 && frame - settledAt >= SETTLE_EXTRA) break;
  }
  const luma = lumaOf(core);
  const checks = [
    { name: 'engine alive and new game reached', ok: state.stopped === null && startedAt >= 0, detail: `frames ${frame} newGameAt ${startedAt} stopped ${String(state.stopped)}` },
    rosterCheck(ram, prepared.partyIds),
    maskCheck(ram, prepared.partyIds),
    ...flagChecks(ram, prepared.flags),
    goldCheck(ram, args.options.itemDifficulty === 'hard', grants.goldGranted()),
    ...magicChecks(ram, args.options.unlockedMagic === true),
    notBlackCheck(luma),
  ];
  core._CkStop();
  return { party: prepared.party, checks };
};

export { runSeed };
