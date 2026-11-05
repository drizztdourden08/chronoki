/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { battleRunning, battleStaged, onForest, readyToWalk, walkInput } from './battle-entry.mjs';
import { createBattlePad } from './battle-input.mjs';
import { actionOf, actionText, seatsOf, sheetAt, sheetOf } from './battle-read.mjs';
import { bootEngine, stepFrame } from './boot.mjs';
import { inputAt } from './input-script.mjs';
import { ramReader } from './ram.mjs';

const SEATS_READ_AFTER = 200;
const PAD_FROM = 150;
const GATE_INI = '[chronoki]\nduplicate_characters=1\n';

const primeSlots = (ram, slots, tpOwed) => {
  for (const slot of slots) {
    const b = sheetAt(slot);
    ram.write(b + 0x2b, 1); ram.write(b + 0x2c, 0);
    ram.write(b + 0x2d, tpOwed & 0xff); ram.write(b + 0x2e, tpOwed >> 8);
    ram.write(0x7e2837 + slot, 0x80); ram.write(0x7e2830 + slot, 1);
  }
};

const createRun = async (mods, args, wasmDir) => {
  const prepared = mods.prepareSeedPack(new Uint8Array(readFileSync(args.pack)), args.options, args.party, args.seed);
  const attacks = [];
  const onErr = (line) => { if (line.startsWith('atkform')) attacks.push(line); };
  const ini = `[game]\nrandomizer = 1\n${args.gate ? GATE_INI : ''}`;
  const engine = await bootEngine(wasmDir, prepared.bytes, { ini, env: { CT_BATTLE_TRACE: '1' }, onErr });
  const ram = ramReader(engine.core);
  const grants = mods.createHeadlessGrants(args.options, {
    heap: () => engine.core.HEAPU8, wramPtr: () => engine.core._CkWramPtr(), isLive: () => engine.state.stopped === null, onLoaded: () => () => {},
  });
  const report = { partyIds: prepared.partyIds, before: [], primed: [], seats: [], actions: [], attacks, casts: [], after: [], battleAt: -1, battleFrames: -1 };
  return { engine, ram, grants, prepared, report, pad: createBattlePad(() => args.tech) };
};

const fieldStep = (run, args, progress, frame) => {
  const { ram, prepared, report } = run;
  if (progress.mapAt < 0) {
    if (progress.startedAt >= 0 && onForest(ram)) progress.mapAt = frame;
    return progress.mapAt < 0 ? inputAt(frame) : 0;
  }
  const onMap = frame - progress.mapAt;
  if (readyToWalk(onMap)) {
    report.before = prepared.partyIds.map((slot) => sheetOf(ram, slot));
    primeSlots(ram, prepared.partyIds, args.tpOwed);
    report.primed = prepared.partyIds.map((slot) => sheetOf(ram, slot));
  }
  if (report.primed.length > 0 && battleStaged(ram)) { progress.battleAt = frame; report.battleAt = onMap; }
  return walkInput(onMap);
};

const battleStep = (run, progress, frame) => {
  const { ram, report, pad } = run;
  const inBattle = frame - progress.battleAt;
  if (inBattle === SEATS_READ_AFTER) report.seats = seatsOf(ram);
  pad.observe(ram, inBattle);
  const text = actionText(actionOf(ram));
  if (text !== progress.lastAction) { report.actions.push(`d${inBattle} ${text}`); progress.lastAction = text; }
  if (inBattle > SEATS_READ_AFTER && !battleRunning(ram)) { progress.doneAt = frame; report.battleFrames = inBattle; }
  return inBattle > PAD_FROM ? pad.input(ram, inBattle) : 0;
};

const runBattle = async (mods, args, wasmDir) => {
  const run = await createRun(mods, args, wasmDir);
  const { engine, grants, ram, prepared, report } = run;
  const progress = { startedAt: -1, mapAt: -1, battleAt: -1, doneAt: -1, lastAction: '' };
  for (let frame = 0; frame < args.frames && engine.state.stopped === null; frame++) {
    if (progress.doneAt >= 0 && frame - progress.doneAt > args.tail) break;
    const input = progress.battleAt < 0 ? fieldStep(run, args, progress, frame) : progress.doneAt < 0 ? battleStep(run, progress, frame) : 0;
    await stepFrame(engine, input);
    grants.observe();
    if (progress.startedAt < 0 && grants.started()) progress.startedAt = frame;
  }
  report.casts = run.pad.casts;
  report.after = prepared.partyIds.map((slot) => sheetOf(ram, slot));
  report.stopped = engine.state.stopped;
  engine.core._CkStop();
  return report;
};

export { runBattle };
