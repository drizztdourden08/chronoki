/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { checkLoadable } from './check-loadable';
import { decodeSectionedState } from './decode-sectioned-state';
import { encodeCkState } from './encode-ck-state';
import { encodeSectionedState } from './encode-sectioned-state';
import { engineStateOf } from './engine-state-of';
import { readCkStamp } from './read-ck-stamp';

const text = (value: string): Uint8Array => new TextEncoder().encode(value);
const stamped = (stamp: string): Uint8Array =>
  encodeSectionedState([{ tag: 'STMP', version: 1, bytes: text(stamp) }, { tag: 'SCEN', version: 1, bytes: new Uint8Array([1]) }]);
const current = readCkStamp('pin=abcdef0123\ncore=0.1.0\nschema=aaaa\nmode=field\n');

describe('CKST sectioned container', { tags: ['critical'] }, () => {
  it('loads a state with the current schema', () => {
    expect(checkLoadable(stamped('pin=x\ncore=0.1.0\nschema=aaaa\nmode=field\n'), current).ok).toBe(true);
  });

  it('refuses another schema with a readable reason', () => {
    const verdict = checkLoadable(stamped('pin=abcdef0123\ncore=0.0.9\nschema=bbbb\nmode=field\n'), current);
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) expect(verdict.message).toContain('0.0.9');
  });

  it('loads an overworld state of the same format and refuses a non-state', () => {
    const world = checkLoadable(stamped('pin=x\ncore=0.1.0\nschema=aaaa\nmode=world\n'), current);
    expect(world.ok).toBe(true);
    expect(checkLoadable(new Uint8Array([1, 2, 3]), current).ok).toBe(false);
  });

  it('loads a menu state (MENU and MPIC beside the underlying mode) and keeps its sections', () => {
    const menu = (mode: string, extra: { tag: string; bytes: Uint8Array }[]): Uint8Array =>
      encodeSectionedState([
        { tag: 'STMP', version: 1, bytes: text(`pin=x\ncore=0.1.0\nschema=aaaa\nmode=${mode}\n`) },
        { tag: 'SCEN', version: 1, bytes: new Uint8Array([1]) },
        { tag: 'MENU', version: 1, bytes: new Uint8Array([2, 3]) },
        ...extra.map((s) => ({ ...s, version: 1 })),
      ]);
    const field = menu('menu-field', [{ tag: 'MPIC', bytes: new Uint8Array([1, 9, 9, 9]) }]);
    expect(readCkStamp('pin=x\ncore=0.1.0\nschema=aaaa\nmode=menu-field\n').mode).toBe('menu-field');
    expect(checkLoadable(field, current).ok).toBe(true);
    expect(checkLoadable(menu('menu-world', []), current).ok).toBe(true);
    expect(decodeSectionedState(field)?.sections.map((s) => s.tag)).toEqual(['STMP', 'SCEN', 'MENU', 'MPIC']);
  });

  it('upgrades a v1 field state so it keeps loading', () => {
    const v1 = encodeCkState({ scene: new Uint8Array([7]), apu: new Uint8Array([8]), options: new Uint8Array([]) });
    const upgraded = engineStateOf(v1);
    expect(upgraded && checkLoadable(upgraded, current).ok).toBe(true);
  });
});
