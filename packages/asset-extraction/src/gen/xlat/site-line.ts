/* @layer shared-asset-extraction @kind logic */
import { hx } from './hx';
import { siteComment } from './site-comment';
import type { Site, Sites } from './xlat-site.type';
import { successors } from './successors';

const ramCode = (adr: number): boolean => {
  const k = adr >> 16;
  const p = adr & 0xffff;
  return k === 0x7e || k === 0x7f || ((k < 0x40 || (k >= 0x80 && k < 0xc0)) && p < 0x2000);
};

const execOf = (adr: number, s: Site): string => {
  const pad = [...s.bytes];
  while (pad.length < 4) pad.push(0);
  return ramCode(adr) && !s.smc
    ? `X_EXEC_RAM(0x${hx(s.op, 2)}, ${s.len}, 0x${hx(pad[1] as number, 2)}, 0x${hx(pad[2] as number, 2)}, 0x${hx(pad[3] as number, 2)});`
    : `X_EXEC(0x${hx(s.op, 2)});`;
};

const targetFlow = (t: number | undefined, sites: Sites, stops: Set<number>): string => {
  if (t === undefined) return '';
  if (sites.has(t)) return ` if (X_PC == 0x${hx(t, 6)}) goto L_${hx(t, 6)};`;
  if (stops.has(t)) return ` if (X_PC == 0x${hx(t, 6)}) return CT_XLAT_EXIT;`;
  return '';
};

const fallFlow = (adr: number, s: Site, falls: boolean, hasNext: boolean): string => {
  if (!falls) return ' goto dispatch;';
  if (s.op === 0x54 || s.op === 0x44) return ` if (X_PC == 0x${hx(adr, 6)}) goto L_${hx(adr, 6)};`;
  return hasNext ? '' : ' goto dispatch;';
};

const siteLine = (adr: number, s: Site, sites: Sites, stops: Set<number>): string => {
  const { targets, falls, next } = successors(adr, s);
  const flow = targetFlow(targets[0], sites, stops) + fallFlow(adr, s, falls, sites.has(next));
  return `L_${hx(adr, 6)}: X_BOUNDARY(0x${hx(adr, 6)}); ${execOf(adr, s)}${flow}  // ${siteComment(adr, s)}`;
};

export { siteLine };
