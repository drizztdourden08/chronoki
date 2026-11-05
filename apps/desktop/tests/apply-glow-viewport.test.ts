/* @layer tests @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { CkViewBlack } from '@chronoki/game-core';
import { applyGlowViewport } from '@app/views/GameLayer/behavior/apply-glow-viewport';
import { initialFade } from '@app/views/GameLayer/behavior/initial-fade';

const controls = () => ({ setEnabled: vi.fn(), setBlackBounds: vi.fn(), setMaxBounds: vi.fn() });
const wideField: CkViewBlack = { field: true, top: 0, bottom: 0, left: 96, right: 96 };

describe('the edge effect applies in the field only when there is black to fill', { tags: ['critical'] }, () => {
  it('turns on and sets the bounds for a field frame with black columns', () => {
    const renderer = controls();
    const active = applyGlowViewport(renderer, wideField, true, initialFade());
    expect(active).toBe(true);
    expect(renderer.setEnabled).toHaveBeenLastCalledWith(true);
    expect(renderer.setBlackBounds).toHaveBeenCalledWith(96, 96, 0, 0);
    expect(renderer.setMaxBounds).toHaveBeenCalledWith(96, 96, 0, 0);
  });

  it('stays off when the setting is off', () => {
    const renderer = controls();
    expect(applyGlowViewport(renderer, wideField, false, initialFade())).toBe(false);
    expect(renderer.setEnabled).toHaveBeenLastCalledWith(false);
  });

  it('stays off when the field frame has no black', () => {
    const renderer = controls();
    const none: CkViewBlack = { field: true, top: 0, bottom: 0, left: 0, right: 0 };
    expect(applyGlowViewport(renderer, none, true, initialFade())).toBe(false);
  });

  it('stays off outside the field and restarts the fade for the next field', () => {
    const renderer = controls();
    const fade = { ...initialFade(), fadeOpacity: 1, prevBlackLeft: 96 };
    expect(applyGlowViewport(renderer, { ...wideField, field: false }, true, fade)).toBe(false);
    expect(renderer.setBlackBounds).not.toHaveBeenCalled();
    expect(fade).toMatchObject({ fadeOpacity: 0, fadeTarget: 1, prevBlackLeft: -1 });
  });

  it('stays off when the engine reports nothing', () => {
    const renderer = controls();
    expect(applyGlowViewport(renderer, null, true, initialFade())).toBe(false);
    expect(renderer.setEnabled).toHaveBeenLastCalledWith(false);
  });
});
