/* @layer tooling-scripts @kind logic */
import { check } from './checks.mjs';
import { hex } from './ram.mjs';

const LOCATION = 0x7e0100;

const locationChecks = (ram, want) => {
  if (want === null) return [];
  const got = ram.word(LOCATION);
  return [check('location', got === want, `want ${hex(want, 4)} got ${hex(got, 4)}`)];
};

const expectChecks = (ram, expects) => expects.map(({ at, not, value, mask }) => {
  const got = ram.byte(at);
  const equal = (got & mask) === (value & mask);
  return check(`expect ${hex(at, 6)} ${not ? '!=' : '=='} ${hex(value & mask)} mask ${hex(mask)}`, equal !== not, `got ${hex(got & mask)} raw ${hex(got)}`);
});

const scenarioChecks = (ram, scenario) => [...locationChecks(ram, scenario.location), ...expectChecks(ram, scenario.expects)];

const applyPokes = (ram, scenario, since) => {
  for (const poke of scenario.pokes.filter((entry) => entry.frame === since)) ram.write(poke.at, poke.value);
};

export { applyPokes, scenarioChecks };
