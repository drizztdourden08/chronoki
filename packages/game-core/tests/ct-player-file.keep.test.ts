/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { ctOptionRows, ctPlayerFileOf } from '../src/randomizer/archipelago';
import { ctPlayerValuesOf } from '../src/randomizer/archipelago/ct-player-values-of';
import type { CtOptionValues } from '../src/randomizer/world/ct-world-input.type';
import { CT_OPTION_CATALOG } from '../src/randomizer/world/ct-options.constants';
import { withCtOptionDefaults } from '../src/randomizer/world/with-ct-option-defaults';

const SLOT = 'Crono';
const UNKNOWN_KEY = 'notAnOption';

const optionsOf = (over: Record<string, unknown>): CtOptionValues => withCtOptionDefaults(over);
const renderYaml = (over: Record<string, unknown>, deathLink?: boolean): string =>
  ctPlayerFileOf({
    slotName: SLOT, world: { checks: [], options: optionsOf(over) }, ...(deathLink === undefined ? {} : { deathLink }),
  }).yaml;

const lineOf = (yaml: string, key: string): string | undefined =>
  yaml.split('\n').find((line) => line.trimStart().startsWith(`${key}:`))?.trim();

const writtenAs = (key: string, value: string | number): readonly string[] => {
  const choice = ctOptionRows().find((row) => row.key === key)?.choices?.find((candidate) => candidate.value === String(value));
  return [`${key}: ${String(value)}`, ...(choice === undefined ? [] : [`${key}: ${choice.id}`])];
};

describe('the player file', { tags: ['critical'] }, () => {
  it('writes death_link from the profile toggle over the frozen row', () => {
    expect(ctOptionRows().some((row) => row.key === 'death_link')).toBe(true);
    expect(lineOf(renderYaml({}, true), 'death_link')).toBe('death_link: true');
    expect(lineOf(renderYaml({ death_link: true }, false), 'death_link')).toBe('death_link: false');
  });

  it('keeps death_link in the file when the profile has no say', () => {
    expect(lineOf(renderYaml({}), 'death_link')).toBeDefined();
  });

  it('drops mysterySeed and every key outside the exported rows', () => {
    const rows = ctOptionRows();
    expect(rows.some((row) => row.key === 'mysterySeed')).toBe(false);
    expect(ctPlayerValuesOf({ mysterySeed: true, [UNKNOWN_KEY]: 1, partySize: 4 }, rows)).toEqual({ partySize: 4 });
    const yaml = renderYaml({ mysterySeed: true, [UNKNOWN_KEY]: 1 });
    expect(yaml).not.toContain('mysterySeed');
    expect(yaml).not.toContain(UNKNOWN_KEY);
  });

  it('fills the default of an option the profile left out, partySize among them', () => {
    const option = CT_OPTION_CATALOG.find((candidate) => candidate.key === 'partySize');
    expect(option).toBeDefined();
    expect(writtenAs('partySize', String(option?.default))).toContain(lineOf(renderYaml({}), 'partySize'));
  });

  it('writes a value the profile did set over the default', () => {
    expect(writtenAs('partySize', 5)).toContain(lineOf(renderYaml({ partySize: 5 }), 'partySize'));
  });

  it('names the slot', () => {
    const file = ctPlayerFileOf({ slotName: SLOT, world: { checks: [] } });
    expect(file.slotName).toBe(SLOT);
    expect(file.yaml).toContain(SLOT);
  });
});
