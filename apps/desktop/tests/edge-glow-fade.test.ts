/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import type { CkViewBlack } from '@chronoki/game-core';
import { edgeGlowFade } from '@app/views/GameLayer/behavior/edge-glow-fade';
import { initialFade } from '@app/views/GameLayer/behavior/initial-fade';
import { FADE_IN_PER_SECOND, FADE_OUT_PER_SECOND } from '@app/views/GameLayer/behavior/useEdgeGlowLoop.constants';

const room: CkViewBlack = { field: true, top: 0, bottom: 0, left: 96, right: 96 };

describe('the edge effect fades out and in around a screen change', { tags: ['critical'] }, () => {
  it('keeps the effect up while the bounds stay put', () => {
    const fade = initialFade();
    edgeGlowFade.trackFieldCrossing(fade, room, true);
    edgeGlowFade.trackFieldCrossing(fade, { ...room, left: 100 }, true);
    expect(fade.fadeTarget).toBe(1);
  });

  it('aims at zero when the bounds jump, then back at one once they settle', () => {
    const fade = initialFade();
    edgeGlowFade.trackFieldCrossing(fade, room, true);
    edgeGlowFade.trackFieldCrossing(fade, { ...room, left: 0, right: 0 }, false);
    expect(fade.fadeTarget).toBe(0);
    edgeGlowFade.trackFieldCrossing(fade, { ...room, left: 0, right: 0 }, true);
    expect(fade.fadeTarget).toBe(1);
  });

  it('does not treat the first sample as a jump', () => {
    const fade = initialFade();
    edgeGlowFade.trackFieldCrossing(fade, room, true);
    expect(fade.fadeTarget).toBe(1);
    expect(fade.prevBlackLeft).toBe(96);
  });

  it('restarts from nothing and forgets the last bounds', () => {
    const fade = initialFade();
    edgeGlowFade.trackFieldCrossing(fade, room, true);
    edgeGlowFade.restartFade(fade);
    expect(fade).toMatchObject({ prevBlackLeft: -1, fadeOpacity: 0, fadeTarget: 1 });
  });

  it('steps the opacity out faster than in and stops on the target', () => {
    const fade = { ...initialFade(), fadeOpacity: 0.5, fadeTarget: 0 };
    edgeGlowFade.stepFadeOpacity(fade, 0.01);
    expect(fade.fadeOpacity).toBeCloseTo(0.5 - 0.01 * FADE_OUT_PER_SECOND);
    edgeGlowFade.stepFadeOpacity(fade, 10);
    expect(fade.fadeOpacity).toBe(0);
    fade.fadeTarget = 1;
    edgeGlowFade.stepFadeOpacity(fade, 0.01);
    expect(fade.fadeOpacity).toBeCloseTo(0.01 * FADE_IN_PER_SECOND);
    edgeGlowFade.stepFadeOpacity(fade, 10);
    expect(fade.fadeOpacity).toBe(1);
  });
});
