/* @layer shared-asset-extraction @kind logic */
import type { OperandSite } from './disasm.type';
import { operandText } from './operand-text';
import { regName } from './reg-name';

const fmt = (mnem: string, mode: string, site: OperandSite): [string, number | null, string | null] => {
  let val = 0;
  site.ob.forEach((by, i) => {
    val += by * 2 ** (8 * i);
  });
  const { o, t } = operandText(mode, site, val);
  let reg: string | null = null;
  if (mode === 'dp' || mode === 'dpx' || mode === 'dpy') reg = regName(val & 0xffff);
  else if (mode === 'abs' || mode === 'abx' || mode === 'aby') reg = regName(val);
  return [mnem + (o ? ` ${o}` : ''), t, reg];
};

export { fmt };
