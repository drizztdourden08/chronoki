/* @layer tooling-scripts @kind logic */
const flagValues = (argv, flag) => argv.flatMap((arg, i) => (arg === flag ? [argv[i + 1] ?? ''] : []));

const hexOf = (text, what) => {
  const clean = text.replace(/^0x/i, '');
  if (!/^[0-9a-f]+$/i.test(clean)) throw new Error(`${what} needs hex, got "${text}"`);
  return parseInt(clean, 16);
};

const expectOf = (text) => {
  const match = /^([^=!]+)(!?)=([^/]+)(?:\/(.+))?$/.exec(text);
  if (match === null) throw new Error(`--expect needs addr=hex[/mask] or addr!=hex[/mask], got "${text}"`);
  return {
    at: hexOf(match[1], '--expect addr'),
    not: match[2] === '!',
    value: hexOf(match[3], '--expect value'),
    mask: match[4] === undefined ? 0xff : hexOf(match[4], '--expect mask'),
  };
};

const pokeOf = (text) => {
  const match = /^([^=]+)=([^@]+)@(\d+)$/.exec(text);
  if (match === null) throw new Error(`--poke needs addr=hex@frame, got "${text}"`);
  return { at: hexOf(match[1], '--poke addr'), value: hexOf(match[2], '--poke value'), frame: Number(match[3]) };
};

const scenarioOf = (argv) => {
  const location = flagValues(argv, '--expect-location')[0];
  const after = flagValues(argv, '--expect-after')[0];
  const pokes = flagValues(argv, '--poke').map(pokeOf);
  const lastPoke = pokes.reduce((last, poke) => Math.max(last, poke.frame), 0);
  return {
    location: location === undefined ? null : hexOf(location, '--expect-location'),
    expects: flagValues(argv, '--expect').map(expectOf),
    pokes,
    holdFrames: pokes.length === 0 && after === undefined ? 0 : lastPoke + Number(after ?? 0),
  };
};

export { scenarioOf };
