/* @layer shared-asset-extraction @kind logic */
import { byteAt, RomIndexError } from '../bytes/byte-reader';
import { ACTOR_OPS } from './script-ops-actor';
import { DATA_OPS } from './script-ops-data';
import { FLOW_OPS } from './script-ops-flow';
import { opLen } from './script-oplen';
import type { OpHandler, RunCtx } from './script-run.type';

const OP_HANDLERS = new Map<number, OpHandler>([...FLOW_OPS, ...DATA_OPS, ...ACTOR_OPS]);
/** Return / yield-forever / hand to the player: the function ends. */
const STOP_OPS = new Set([0x00, 0xaf, 0xb0, 0xb1, 0xb2]);
const OP_LIMIT = 6000;

/**
 * script.run_func (the init-pass use: no textbox capture, no cross-object follow): executes object `c.obj`'s function
 * from `start`, updating the actors and WRAM until Return, a forever-yield, the end of the body or the op limit.
 * A read past the end of the body ends it (Python's IndexError).
 */
const runFunc = (c: RunCtx, start: number): void => {
  let addr = start;
  let ops = 0;
  while (addr >= 0 && addr < c.body.length && ops < OP_LIMIT) {
    try {
      const op = byteAt(c.body, addr);
      let nxt = addr + opLen(c.body, addr);
      if (STOP_OPS.has(op)) return;
      const handler = OP_HANDLERS.get(op);
      if (handler) nxt = handler(c, addr, nxt);
      addr = nxt;
    } catch (e) {
      if (e instanceof RomIndexError) return;
      throw e;
    }
    ops += 1;
  }
};

export { runFunc };
