/* @layer shared-asset-extraction @kind logic */

const hx = (value: number, digits: number): string => value.toString(16).toUpperCase().padStart(digits, '0');

const linesKept = (text: string): string[] => text.replaceAll('\r\n', '\n').match(/[^\n]*\n|[^\n]+$/g) ?? [];

const familyTrace = (name: string, traces: string[], range: [number, number]): { text: string; count: number } => {
  const [lo, hi] = range;
  const seen = new Set<string>();
  const kept: string[] = [];
  for (const trace of traces) {
    for (const ln of linesKept(trace)) {
      if (ln.slice(2, 3) !== ':' || ln.startsWith('--')) continue;
      const adr = (Number.parseInt(ln.slice(0, 2), 16) << 16) | Number.parseInt(ln.slice(3, 7), 16);
      if (!(lo <= adr && adr <= hi)) continue;
      const p = ln.indexOf(' P=');
      if (p < 0) throw new Error(`xlat_all: ${name}: a trace line has no P= field`);
      const key = ln.slice(0, 16) + ln.slice(p, p + 12);
      if (seen.has(key)) continue;
      seen.add(key);
      kept.push(ln);
    }
  }
  const first = kept[0] ?? '';
  if (!first.startsWith(`${hx(lo >> 16, 2)}:${hx(lo & 0xffff, 4)} `)) {
    throw new Error(`xlat_all: ${name}: the family does not begin at its entry (${first.slice(0, 7)})`);
  }
  return { text: kept.join(''), count: kept.length };
};

export { familyTrace, hx };
