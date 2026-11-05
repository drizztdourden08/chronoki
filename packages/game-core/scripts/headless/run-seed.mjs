/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { bootEngine, lumaOf, stepFrame } from './boot.mjs';
import { flagChecks, goldCheck, maskCheck, notBlackCheck, rosterCheck } from './checks.mjs';
import { inputAt } from './input-script.mjs';
import { magicChecks } from './magic-checks.mjs';
import { ramReader } from './ram.mjs';
import { applyPokes, scenarioChecks } from './scenario-checks.mjs';

const AFTER_START_MIN = 360;
const POLL_EVERY = 30;
const SETTLE_EXTRA = 60;

const partyMatches = (ram, prepared) => rosterCheck(ram, prepared.partyIds).ok && maskCheck(ram, prepared.partyIds).ok;

const settledSince = (progress, frame, hold) => progress.settledAt >= 0 && frame - progress.settledAt >= SETTLE_EXTRA && frame - progress.startedAt >= hold;

const advance = ({ grants, ram, prepared }, progress, frame) => {
  if (progress.startedAt < 0 && grants.started()) progress.startedAt = frame;
  const waited = progress.startedAt >= 0 && frame - progress.startedAt >= AFTER_START_MIN && frame % POLL_EVERY === 0;
  if (progress.settledAt < 0 && waited && partyMatches(ram, prepared)) progress.settledAt = frame;
};

const runFrames = async (run) => {
  const { engine, args, grants, ram } = run;
  const progress = { startedAt: -1, settledAt: -1, frame: 0 };
  for (; progress.frame < args.frames && engine.state.stopped === null; progress.frame++) {
    await stepFrame(engine, inputAt(progress.frame));
    grants.observe();
    advance(run, progress, progress.frame);
    if (progress.startedAt >= 0) applyPokes(ram, args.scenario, progress.frame - progress.startedAt);
    if (settledSince(progress, progress.frame, args.scenario.holdFrames)) break;
  }
  return progress;
};

const checksOf = ({ engine, args, grants, ram, prepared }, progress) => [
  { name: 'engine alive and new game reached', ok: engine.state.stopped === null && progress.startedAt >= 0, detail: `frames ${progress.frame} newGameAt ${progress.startedAt} stopped ${String(engine.state.stopped)}` },
  rosterCheck(ram, prepared.partyIds),
  maskCheck(ram, prepared.partyIds),
  ...flagChecks(ram, prepared.flags),
  goldCheck(ram, args.options.itemDifficulty === 'hard', grants.goldGranted()),
  ...magicChecks(ram, args.options.unlockedMagic === true),
  ...scenarioChecks(ram, args.scenario),
  notBlackCheck(lumaOf(engine.core)),
];

const runSeed = async (mods, args, wasmDir) => {
  const base = readFileSync(args.pack);
  const prepared = mods.prepareSeedPack(new Uint8Array(base), args.options, args.party ?? mods.legacyParty, args.seed);
  const engine = await bootEngine(wasmDir, prepared.bytes);
  const ram = ramReader(engine.core);
  const grants = mods.createHeadlessGrants(args.options, {
    heap: () => engine.core.HEAPU8, wramPtr: () => engine.core._CkWramPtr(), isLive: () => engine.state.stopped === null, onLoaded: () => () => {},
  });
  const run = { engine, args, grants, ram, prepared };
  const progress = await runFrames(run);
  const checks = checksOf(run, progress);
  engine.core._CkStop();
  return { party: prepared.party, checks };
};

export { runSeed };
