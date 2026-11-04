/* @layer shared-asset-extraction @kind logic */
import { hx } from './hx';

const linesKept = (text: string): string[] => text.replaceAll('\r\n', '\n').match(/[^\n]*\n|[^\n]+$/g) ?? [];

const lineKey = (ln: string, name: string, range: [number, number]): string | null => {
  if (ln.slice(2, 3) !== ':' || ln.startsWith('--')) return null;
  const adr = (Number.parseInt(ln.slice(0, 2), 16) << 16) | Number.parseInt(ln.slice(3, 7), 16);
  if (!(range[0] <= adr && adr <= range[1])) return null;
  const p = ln.indexOf(' P=');
  if (p < 0) throw new Error(`xlat_all: ${name}: a trace line has no P= field`);
  return ln.slice(0, 16) + ln.slice(p, p + 12);
};

const familyTrace = (name: string, traces: string[], range: [number, number]): { text: string; count: number } => {
  const lo = range[0];
  const seen = new Set<string>();
  const kept: string[] = [];
  for (const ln of traces.flatMap(linesKept)) {
    const key = lineKey(ln, name, range);
    if (key === null || seen.has(key)) continue;
    seen.add(key);
    kept.push(ln);
  }
  const first = kept[0] ?? '';
  if (!first.startsWith(`${hx(lo >> 16, 2)}:${hx(lo & 0xffff, 4)} `)) {
    throw new Error(`xlat_all: ${name}: the family does not begin at its entry (${first.slice(0, 7)})`);
  }
  return { text: kept.join(''), count: kept.length };
};

export { familyTrace };
