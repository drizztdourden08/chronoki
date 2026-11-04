// The host section's guard (docs/plans/save-state-host-fields.md). field.c's main() keeps its mode machine in about 385
// locals declared before the main loop. Renaming the persistent ones to `hs->name` across the 10,000-line main() would be a
// wide text transform on a file upstream changes daily, and a nested local of the same name would turn it silently
// wrong. The locals stay as they are instead: ck_host_point.inc, included at the top of the loop (the one safe point,
// where only main()'s top-level names are in scope), copies them into CtHostState for a save and back after a load, from
// the X-macro list core/reconnect/ck_host_fields.h. This module keeps that list exact: every local main() declares before
// its loop (main-locals.mjs) must be either a host field or named below with its class, and every name here must still
// be declared. A new, renamed or removed local fails the build with its name, so nothing upstream adds is silently left
// out of the state. A changed type fails the compile (the _Static_asserts in ck_host_point.inc).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { mainLocals } from './main-locals.mjs';

// the locals not in the host section, by class (the doc says why for each)
const EXCLUDED = {
  config: `macStatus androidStatus sprTest descTest selftest talkObj gotoExit tframes targetPage chooseSel doSelect atX atY
    showPrio walkDir reenterDest sceneSet bootNatural battleTest menuTest worldTest gmem haveFlags vehicleFrameBase fontLen
    pfacInit camSeeded stateRestored worldBlobLen audioOn audioHz audioSamplesPerFrame wramSeeded ruleSpc ruleSeeded powerOn
    FADE_STEP GW_SETUP selftestFrames nmLastId ldrPrevDir`,
  pointer: `datpath shot flagsPath walkScript playScript loadWramPath loadStatePath btWramPath btWram font audioBuf audio seedSpc
    pr win fb sidx front pmask menuFrozen menuStash menuFb gwN tbStr`,
  resource: 'assets f wd liveHost pc audioDev haveWorld loadWalk tbStrLen',
  harness: `wtStage mtSprSeq mtSprChar mtPre mtPost mtNp mtDataOk mtResumeOk mtFnv mtItemOk mtStatusOk mtTechOk mtConfigOk
    mtFormOk mtSaveOk mtHp btBattleFrame battleResolved battleResolveFrame noPcVisit noPcShot ldrShot introShot seqShot pLastAf
    menuPrevDx menuPrevDy didSelect running prevF5 prevF9 pendStateLoc`,
  scratch: 'spal',
};

const HOST_RE = /CK_HOST\(\s*([^,]+?)\s*,\s*(\w+)\s*,\s*([^)]*?)\s*\)/g;

// [{ type, name, dims }] in ck_host_fields.h's order
const hostFieldList = (root) => {
  const text = readFileSync(join(root, 'core', 'reconnect', 'ck_host_fields.h'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  return [...text.matchAll(HOST_RE)].map((m) => ({ type: m[1], name: m[2], dims: m[3].replace(/\s+/g, '') }));
};

const excludedNames = () =>
  new Map(Object.entries(EXCLUDED).flatMap(([cls, names]) => names.split(/\s+/).filter(Boolean).map((n) => [n, cls])));

const plainType = (local) => local.type.replace(/\bstatic\s+/, '').replace(/\s+\*/g, '*');

const problems = (locals, host, excluded) => {
  const out = [];
  const declared = new Map(locals.map((l) => [l.name, l]));
  const seen = new Set();
  for (const l of locals) {
    if (seen.has(l.name)) out.push(`${l.name} is declared twice before the loop`);
    seen.add(l.name);
    if (!host.some((h) => h.name === l.name) && !excluded.has(l.name)) out.push(`${l.name} (${l.type}${l.dims}) is new: classify it`);
  }
  for (const h of host) {
    const l = declared.get(h.name);
    if (!l) out.push(`host field ${h.name} is no longer declared`);
    else if (plainType(l) !== h.type || l.dims.replace(/\s+/g, '') !== h.dims) out.push(`${h.name} is ${l.type}${l.dims} upstream, ${h.type}${h.dims} in ck_host_fields.h`);
    if (excluded.has(h.name)) out.push(`${h.name} is both a host field and excluded (${excluded.get(h.name)})`);
  }
  for (const [name, cls] of excluded) if (!declared.has(name)) out.push(`excluded ${name} (${cls}) is no longer declared`);
  return out;
};

// throws, naming every mismatch, unless main()'s pre-loop locals are exactly the host fields plus the excluded names
const checkHostFields = (field, root) => {
  const found = problems(mainLocals(field), hostFieldList(root), excludedNames());
  if (found.length) {
    throw new Error(`field.c main()'s locals moved upstream; update core/reconnect/ck_host_fields.h or host-fields.mjs:\n  ${found.join('\n  ')}`);
  }
};

export { checkHostFields, hostFieldList }
