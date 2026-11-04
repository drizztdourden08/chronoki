/* @layer shared-asset-extraction @kind logic */
const GROUP = /\(([^()]*)\)\*(\d+)/;

/** recipes.py expand(): `(a:n,b:m)*K` becomes the group K times (nestable); spaces are dropped. */
const expandPadScript = (script: string): string => {
  let out = script;
  while (out.includes('(')) {
    const m = GROUP.exec(out);
    if (!m) throw new Error(`recipes: a bad group in the pad script ${JSON.stringify(script)}`);
    const times = Number.parseInt(m[2] as string, 10);
    out = out.slice(0, m.index) + Array.from({ length: times }, () => m[1]).join(',') + out.slice(m.index + m[0].length);
  }
  return out.replaceAll(' ', '');
};

export { expandPadScript };
