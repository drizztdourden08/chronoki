/* @layer bridge-wasm @kind logic */
import { OBJECT_FUNCTIONS, OBJECT_HEADER_BYTES } from '../../checks/gift-ops.constants';
import { jumpTarget } from './jump-target';
import { listScriptOps } from './list-script-ops';
import { pointerAt } from './pointer-at';

const verifyScriptBlob = (raw: Uint8Array): string[] => {
  const ops = listScriptOps(raw);
  if (!ops) return ['the spliced script no longer walks from function start to function start'];
  const bounds = new Set<number>([raw.length - 1, ...ops.map((o) => o.at)]);
  const failed: string[] = [];
  ops.forEach((op) => {
    const target = jumpTarget(raw, op);
    if (target !== null && !bounds.has(target)) failed.push(`jump at ${op.at} misses an op boundary`);
  });
  const header = (raw[0] ?? 0) * OBJECT_HEADER_BYTES;
  for (let k = 0; k < (raw[0] ?? 0) * OBJECT_FUNCTIONS; k += 1) {
    const p = pointerAt(raw, k);
    if (p >= header && p <= raw.length - 1 && !bounds.has(p)) failed.push(`pointer ${k} misses an op boundary`);
  }
  return failed;
};

export { verifyScriptBlob };
