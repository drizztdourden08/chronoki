/* @layer shared-asset-extraction @kind logic */
import { byteAt } from '../bytes/byte-reader';
import { RomIndexError } from '../bytes/rom-index-error';
import { opLen } from './script-oplen';
import type { RunCtx } from './script-run.type';
import { OP_HANDLERS, STOP_OPS, OP_LIMIT } from './script-run.constants';

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
