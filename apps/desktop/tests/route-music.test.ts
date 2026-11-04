/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { routeMusic } from '@app/game/msu-session/route-music';

const packWith = (...tracks: number[]) => (track: number): boolean => tracks.includes(track);

describe('routeMusic', { tags: ['critical'] }, () => {
  it('stops the pack track on the silence ids and gives the chip back', () => {
    expect(routeMusic(0x00, packWith(24), true)).toEqual({ cue: 0, packPlaying: false });
    expect(routeMusic(0xff, packWith(24), true)).toEqual({ cue: 0, packPlaying: false });
  });

  it('plays a track the pack has and mutes the chip music', () => {
    expect(routeMusic(24, packWith(24), true)).toEqual({ cue: 24, packPlaying: true });
  });

  it('falls back from track 84 to the file of 24 when the pack lacks 84', () => {
    expect(routeMusic(84, packWith(24), true)).toEqual({ cue: 24, packPlaying: true });
  });

  it('keeps track 84 when the pack has it', () => {
    expect(routeMusic(84, packWith(24, 84), true)).toEqual({ cue: 84, packPlaying: true });
  });

  it('plays a missing track on the chip and stops the pack track', () => {
    expect(routeMusic(30, packWith(24), true)).toEqual({ cue: 0, packPlaying: false });
  });

  it('keeps the chip muted for a missing track when the chip fallback is off', () => {
    expect(routeMusic(30, packWith(24), false)).toEqual({ cue: 0, packPlaying: true });
  });

  it('passes a fade through and leaves the gains alone', () => {
    expect(routeMusic(0x140, packWith(24), true)).toEqual({ cue: 0x140, packPlaying: null });
  });

  it('ignores the intro trigger', () => {
    expect(routeMusic(100, packWith(100), true)).toEqual({ cue: null, packPlaying: null });
  });
});
