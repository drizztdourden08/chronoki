/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../../pipeline/import-context.type';
import { peekOracle } from '../../oracle/peek-access';
import { recipeState } from '../../oracle/recipe-state';
import type { CpuTraceOracle } from './cpu-trace.type';
import { familyTrace } from './xlat-family';
import { XLAT_PROGRAMS } from './xlat-programs.constants';
import type { XlatProgram } from './xlat-program.type';
import { translate } from './xlat-translate';

const address = (text: string): number => Number.parseInt(text.replace(':', ''), 16);

const requireCpuTrace = (ctx: ImportContext): CpuTraceOracle => {
  const driver = ctx.oracle as Partial<CpuTraceOracle> | null;
  if (driver === null || typeof driver.cpuTrace !== 'function') {
    throw new Error('xlat_all: this stage needs the oracle driver to implement cpuTrace (ct.exe --cputrace)');
  }
  return driver as CpuTraceOracle;
};

const buildStates = async (ctx: ImportContext, program: XlatProgram): Promise<Map<string, Uint8Array>> => {
  const states = new Map<string, Uint8Array>();
  for (const [key, st] of Object.entries(program.states)) {
    if ('recipe' in st) states.set(key, await recipeState(ctx, st.recipe));
  }
  for (const [key, st] of Object.entries(program.states)) {
    if (!('peekFrom' in st)) continue;
    const dump = await peekOracle(ctx).peek({ state: states.get(st.peekFrom) as Uint8Array, script: st.script, env: st.env, save: true });
    if (!dump.state) throw new Error(`xlat_all: the state ${key} was not made`);
    states.set(key, dump.state);
  }
  return states;
};

const makeXlat = async (ctx: ImportContext, name: string): Promise<string> => {
  const program = XLAT_PROGRAMS[name];
  if (!program) throw new Error(`xlat_all: no program ${name} (${Object.keys(XLAT_PROGRAMS).join(', ')})`);
  const states = await buildStates(ctx, program);
  const stateOf = (key: string): Uint8Array => states.get(key) as Uint8Array;
  const traces = new Map<string, string>();
  for (const t of program.traces) {
    traces.set(t.name, await requireCpuTrace(ctx).cpuTrace({ state: stateOf(t.state), frames: t.frames, env: { ...t.env, CPUTRACE_UNIQUE: '1' } }));
  }
  const images = new Map<string, Uint8Array>();
  for (const [key, im] of Object.entries(program.images)) {
    images.set(key, (await peekOracle(ctx).peek({ state: stateOf(im.state), script: im.script })).wram);
  }
  if (program.family) {
    const fam = familyTrace(name, program.traces.map((t) => traces.get(t.name) as string), program.family);
    traces.set('family', fam.text);
    ctx.log(`xlat_all: ${name}: ${fam.count} lines of FD/C2C1-D52C`);
  }
  return translate({
    name,
    rom: ctx.rom,
    traces: program.pairs.map(([trace, image]) => ({ text: traces.get(trace) as string, image })),
    images,
    starts: new Set(program.froms.map(address)),
    stops: new Set(program.stops.map(address)),
  });
};

export { makeXlat };
