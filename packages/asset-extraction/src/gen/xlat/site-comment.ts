/* @layer shared-asset-extraction @kind logic */
import { fmt } from './disasm';
import { TABLE } from './disasm.constants';
import { hx } from './hx';
import type { Site } from './xlat-site.type';

const siteComment = (adr: number, s: Site): string => {
  const [mnem, mode] = TABLE[s.op] as readonly [string, string];
  const [plain, tgt, reg] = fmt(mnem, mode, { k: adr >> 16, pc: adr & 0xffff, ob: s.bytes.slice(1) });
  const isRel = (mode === 'rel' || mode === 'rell') && tgt !== null;
  const text = isRel ? `${mnem} ->${hx((tgt as number) & 0xffff, 4)}` : plain;
  return text + (reg ? `  ; ${reg}` : '') + (s.traced ? '' : '  [static]') + (s.smc ? '  [SMC operand]' : '');
};

export { siteComment };
