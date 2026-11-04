/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import type { CkStateSection } from './sectioned-state.type';
import { checkLoadable } from './check-loadable';
import { encodeSectionedState } from './encode-sectioned-state';
import { readCkStamp } from './read-ck-stamp';

const text = (value: string): Uint8Array => new TextEncoder().encode(value);
const section = (tag: string): CkStateSection => ({ tag, version: 1, bytes: new Uint8Array([1]) });
const state = (stamp: string[], tags: string[]): Uint8Array =>
  encodeSectionedState([{ tag: 'STMP', version: 1, bytes: text(`${stamp.join('\n')}\n`) }, ...tags.map(section)]);
const current = readCkStamp([
  'pin=abcdef0123', 'core=0.5.0', 'schema=cccc', 'mode=field',
  'sections=CORE:c1,SCEN:s1,HOST:h1,WRLD:w2,MENU:m2,MPIC:p1,APU:a1,APUH:u1',
  'past=oldfield/CORE:c1,SCEN:s1,APU:a1;oldworld/CORE:c1,HOST:h1,WRLD:w1,APU:a1',
].join('\n'));
const FIELD = ['CORE', 'SCEN', 'APU '];

describe('per-section save state schema', { tags: ['critical'] }, () => {
  it('reads the build section ids and past layouts from its stamp', () => {
    expect(current?.sections.WRLD).toBe('w2');
    expect(current?.past.oldfield?.SCEN).toBe('s1');
  });

  it('loads a field state from an older core whose sections are unchanged', () => {
    expect(checkLoadable(state(['pin=x', 'core=0.1.0', 'schema=oldfield', 'mode=field'], FIELD), current).ok).toBe(true);
  });

  it('loads a state from another core version when every section it carries matches', () => {
    const stamp = ['pin=x', 'core=0.4.1', 'schema=bbbb', 'mode=field', 'sections=CORE:c1,SCEN:s1,HOST:h1,APU:a1,APUH:u1'];
    expect(checkLoadable(state(stamp, ['CORE', 'SCEN', 'HOST', 'APU ', 'APUH']), current).ok).toBe(true);
  });

  it('accepts a state without the optional sections it never carried', () => {
    const stamp = ['pin=x', 'core=0.4.1', 'schema=bbbb', 'mode=field', 'sections=CORE:c1,SCEN:s1,APU:a1'];
    expect(checkLoadable(state(stamp, FIELD), current).ok).toBe(true);
  });

  it('refuses an older state whose section changed, naming the section', () => {
    const verdict = checkLoadable(state(['pin=x', 'core=0.3.0', 'schema=oldworld', 'mode=world'], ['CORE', 'HOST', 'WRLD', 'APU ']), current);
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) {
      expect(verdict.reason).toBe('section-changed');
      expect(verdict.message).toContain('0.3.0');
      expect(verdict.message).toContain('overworld (WRLD)');
      expect(verdict.message).not.toContain('CORE');
    }
  });

  it('refuses a stamped section with another id and a section this version does not know', () => {
    const menu = ['pin=x', 'core=0.4.1', 'schema=bbbb', 'mode=menu-field', 'sections=CORE:c1,SCEN:s1,MENU:m1,APU:a1'];
    const changed = checkLoadable(state(menu, ['CORE', 'SCEN', 'MENU', 'APU ']), current);
    expect(changed.ok === false && changed.message.includes('menu (MENU)')).toBe(true);
    const extra = ['pin=x', 'core=0.9.0', 'schema=dddd', 'mode=field', 'sections=CORE:c1,SCEN:s1,APU:a1,XTRA:x1'];
    const unknown = checkLoadable(state(extra, [...FIELD, 'XTRA']), current);
    expect(unknown.ok === false && unknown.message.includes('unknown (XTRA)')).toBe(true);
  });

  it('refuses an older format it has no layout for with a readable reason', () => {
    const verdict = checkLoadable(state(['pin=x', 'core=0.0.9', 'schema=zzzz', 'mode=field'], FIELD), current);
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) expect(verdict.reason).toBe('format-mismatch');
  });
});
