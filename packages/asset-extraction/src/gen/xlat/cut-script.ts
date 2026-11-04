/* @layer shared-asset-extraction @kind logic */

const cutScript = (script: string, frames: number): string => {
  const out: string[] = [];
  let at = 0;
  for (const tok of script.split(',')) {
    const n = Number.parseInt(tok.split(':')[1] as string, 10);
    if (at + n >= frames) {
      out.push(`${(tok.split(':')[0] as string)}:${frames - at}`);
      break;
    }
    out.push(tok);
    at += n;
  }
  return out.join(',');
};

export { cutScript };
