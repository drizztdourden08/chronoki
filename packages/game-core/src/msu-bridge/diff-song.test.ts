/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { diffSong } from './diff-song';
import { FADE_CTRL_BASE } from './msu-bridge.constants';
import type { MusicStateSnapshot } from './music-state.type';

const snap = (over: Partial<MusicStateSnapshot>): MusicStateSnapshot => ({
  seq: 0, dropped: 0, song: 0xff, sfxVoices: 0, fade: 255, valid: true, commands: [], ...over,
});

describe('diffSong', { tags: ['critical'] }, () => {
  it('emits the first song seen', () => {
    expect(diffSong(snap({ song: 24 }), { song: null, fade: null }).ctrls).toEqual([24]);
  });

  it('emits nothing when the song and fade are unchanged', () => {
    expect(diffSong(snap({ song: 24 }), { song: 24, fade: 255 }).ctrls).toEqual([]);
  });

  it('emits a song change that had no ring command', () => {
    expect(diffSong(snap({ song: 7 }), { song: 24, fade: 255 }).ctrls).toEqual([7]);
  });

  it('does not repeat a song the ring already reported', () => {
    const commands = [{ cmd: 0x10, p1: 7, p2: 0, p3: 0, frame: 1 }];
    expect(diffSong(snap({ song: 7, commands }), { song: 24, fade: 255 }).ctrls).toEqual([7]);
  });

  it('reports a same-id resume from the ring', () => {
    const commands = [{ cmd: 0x11, p1: 24, p2: 0, p3: 0, frame: 1 }];
    expect(diffSong(snap({ song: 24, commands }), { song: 24, fade: 255 }).ctrls).toEqual([24]);
  });

  it('ignores effect commands', () => {
    const commands = [{ cmd: 0x18, p1: 3, p2: 0, p3: 0, frame: 1 }];
    expect(diffSong(snap({ song: 24, commands }), { song: 24, fade: 255 }).ctrls).toEqual([]);
  });

  it('follows a fade byte change but not the first reading', () => {
    expect(diffSong(snap({ song: 24, fade: 64 }), { song: 24, fade: 255 }).ctrls).toEqual([FADE_CTRL_BASE + 64]);
    expect(diffSong(snap({ song: 24, fade: 64 }), { song: 24, fade: null }).ctrls).toEqual([]);
  });
});
