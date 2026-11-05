/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { DEATH_PEAK_SONG, ZENAN_SONG } from './alt-music.constants';
import { musicPack } from './alt-music.fixture';
import { planDeathPeakMusic } from './plan-death-peak-music';
import { planZenanMusic } from './plan-zenan-music';

describe('alt music planners', { tags: ['critical'] }, () => {
  it('Zenan: one edit at the single play-song operand', () => {
    const pack = musicPack();
    const plan = planZenanMusic(pack);
    expect(plan.failed).toEqual([]);
    expect(plan.edits).toHaveLength(1);
    expect(plan.edits[0]).toMatchObject({ old: 0x29, next: ZENAN_SONG });
    expect(pack[plan.edits[0]?.at ?? 0]).toBe(0x29);
  });

  it('Zenan: a missing play-song op fails the plan', () => {
    const plan = planZenanMusic(musicPack({ zenanOps: [0x00] }));
    expect(plan.edits).toEqual([]);
    expect(plan.failed).toHaveLength(1);
  });

  it('Death Peak: nine record edits and one script edit', () => {
    const pack = musicPack();
    const plan = planDeathPeakMusic(pack);
    expect(plan.failed).toEqual([]);
    expect(plan.edits).toHaveLength(10);
    plan.edits.forEach((e) => {
      expect(pack[e.at]).toBe(e.old);
      expect(e.next).toBe(DEATH_PEAK_SONG);
    });
  });

  it('Death Peak: a record with the no-song bit fails the plan', () => {
    const plan = planDeathPeakMusic(musicPack({ firstRecordSong: 0x90 }));
    expect(plan.edits).toEqual([]);
    expect(plan.failed).toHaveLength(1);
  });

  it('Death Peak: a script without EA 3C fails the plan', () => {
    const plan = planDeathPeakMusic(musicPack({ peakOps: [0xea, 0x20] }));
    expect(plan.edits).toEqual([]);
    expect(plan.failed).toHaveLength(1);
  });
});
