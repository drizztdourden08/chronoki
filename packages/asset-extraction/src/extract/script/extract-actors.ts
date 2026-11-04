/* @layer shared-asset-extraction @kind logic @source Python script.extract_actors */
import { byteAt } from '../bytes/byte-reader';
import { loadScript } from './script-load';
import type { LoadedScript } from './script-load';
import { createScriptMem } from './script-mem';
import { runFunc } from './script-run';
import type { Actor } from './script-run.type';
import type { SceneActors } from './extract-actors.type';

const extractActors = (rom: Uint8Array, scene: number): SceneActors => {
  const h = rom.slice(0x360000 + scene * 14, 0x360000 + scene * 14 + 14);
  const scriptIndex = byteAt(h, 8) | (byteAt(h, 9) << 8);
  let script: LoadedScript;
  try {
    script = loadScript(rom, scriptIndex);
  } catch {
    script = { objs: [], body: new Uint8Array(0) };
  }
  const { objs, body } = script;
  const mem = createScriptMem();
  const actors: Actor[] = objs.map((_, n) => ({
    obj: n,
    sprite: null,
    pos: null,
    facing: 1,
    draw: 'draw',
    dead: false,
    defined: false,
    visible: false,
  }));
  for (let n = 0; n < objs.length; n += 1) {
    runFunc({ body, obj: n, mem, actors, a: actors[n] as Actor }, (objs[n] as number[])[0] as number);
  }
  for (const a of actors) a.visible = a.defined && a.draw === 'draw' && !a.dead && a.pos !== null;
  return { actors, scriptIndex };
};

export { extractActors };
export type { SceneActors };
