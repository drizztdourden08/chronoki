/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { classifyCtMusic } from './classify-ct-music';
import { FADE_CTRL_BASE } from './msu-bridge.constants';

describe('classifyCtMusic', { tags: ['critical'] }, () => {
  it('turns a song id into a track', () => {
    expect(classifyCtMusic(24)).toEqual({ kind: 'track', track: 24 });
  });

  it('keeps the attract theme as its own track', () => {
    expect(classifyCtMusic(84)).toEqual({ kind: 'track', track: 84 });
  });

  it('keeps silence ids as tracks so the pack stops', () => {
    expect(classifyCtMusic(0xff)).toEqual({ kind: 'track', track: 0xff });
    expect(classifyCtMusic(0)).toEqual({ kind: 'track', track: 0 });
  });

  it('ignores the intro trigger', () => {
    expect(classifyCtMusic(100)).toEqual({ kind: 'ignore' });
  });

  it('reads a fade control as a fade to its level', () => {
    expect(classifyCtMusic(FADE_CTRL_BASE + 64)).toMatchObject({ kind: 'fade', target: 64 });
  });
});
