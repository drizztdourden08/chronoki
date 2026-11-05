/* @layer tests @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SaveStateContext, StateResult } from '@app/game/save-states';

const mocks = vi.hoisted(() => {
  const result: StateResult = { ok: true };
  return { steps: [] as string[], result, manager: true };
});

vi.mock('@drizztdourden08/brock-react', () => ({ nav: { close: () => mocks.steps.push('close-menu') } }));
vi.mock('@app/input/input-manager/peek-input-manager', () => ({
  peekInputManager: () => (mocks.manager ? { resume: () => mocks.steps.push('resume') } : null),
}));
vi.mock('@app/game/save-states', () => ({
  loadState: () => {
    mocks.steps.push('load');
    return Promise.resolve(mocks.result);
  },
}));

const { loadIntoPlay } = await import('@app/views/GameSession/behavior/load-into-play');
const { pauseSyncPlan } = await import('@app/views/GameSession/behavior/pause-sync-plan');
const { inputSuppressedFor } = await import('@app/views/GameSession/behavior/input-suppressed-for');

const ctx: SaveStateContext = Object.assign({} as SaveStateContext, { profileId: 'p1' });
const quick = { kind: 'quick', slot: 0 } as const;

beforeEach(() => {
  mocks.steps = [];
  mocks.result = { ok: true };
  mocks.manager = true;
});

describe('a state load closes the menu and resumes play', { tags: ['critical'] }, () => {
  it('resumes before the load, then closes the menu once the state is in', async () => {
    const result = await loadIntoPlay(ctx, quick);
    expect(result.ok).toBe(true);
    expect(mocks.steps).toEqual(['resume', 'load', 'close-menu']);
  });

  it('closes the menu for a normal and an auto save load the same way', async () => {
    await loadIntoPlay(ctx, { kind: 'normal', id: 'n1' });
    await loadIntoPlay(ctx, { kind: 'auto', id: 'a1' });
    expect(mocks.steps.filter((step) => step === 'close-menu')).toHaveLength(2);
  });

  it('keeps the menu open when the load fails', async () => {
    mocks.result = { ok: false, reason: 'missing' };
    const result = await loadIntoPlay(ctx, quick);
    expect(result.ok).toBe(false);
    expect(mocks.steps).toEqual(['resume', 'load']);
  });

  it('still loads when no input manager exists yet', async () => {
    mocks.manager = false;
    await loadIntoPlay(ctx, quick);
    expect(mocks.steps).toEqual(['load', 'close-menu']);
  });
});

describe('the pause overlay follows one pause flag', { tags: ['critical'] }, () => {
  it('releases a pause left set when the game stops', () => {
    expect(pauseSyncPlan({ running: false, inputPaused: true, status: 'idle' })).toEqual({ releaseInput: true, corePaused: null });
    expect(pauseSyncPlan({ running: false, inputPaused: true, status: 'error' })).toEqual({ releaseInput: true, corePaused: null });
  });

  it('does nothing when stopped and not paused', () => {
    expect(pauseSyncPlan({ running: false, inputPaused: false, status: 'idle' })).toEqual({ releaseInput: false, corePaused: null });
  });

  it('pauses a core that boots or re-plans while the pause flag is set', () => {
    expect(pauseSyncPlan({ running: true, inputPaused: true, status: 'running' })).toEqual({ releaseInput: false, corePaused: true });
  });

  it('unpauses a core left paused after the pause flag was cleared', () => {
    expect(pauseSyncPlan({ running: true, inputPaused: false, status: 'paused' })).toEqual({ releaseInput: false, corePaused: false });
  });

  it('leaves a core that already matches the flag alone', () => {
    expect(pauseSyncPlan({ running: true, inputPaused: true, status: 'paused' }).corePaused).toBeNull();
    expect(pauseSyncPlan({ running: true, inputPaused: false, status: 'running' }).corePaused).toBeNull();
  });

  it('waits while a re-plan or a boot has the core loading', () => {
    expect(pauseSyncPlan({ running: true, inputPaused: true, status: 'loading' })).toEqual({ releaseInput: false, corePaused: null });
    expect(pauseSyncPlan({ running: true, inputPaused: true, status: 'idle' })).toEqual({ releaseInput: false, corePaused: null });
  });
});

describe('game input is held while a menu window covers the game', { tags: ['critical'] }, () => {
  it('suppresses input while a screen is open over the running game', () => {
    expect(inputSuppressedFor(true, true)).toBe(true);
  });

  it('lets input through the moment the menu closes', () => {
    expect(inputSuppressedFor(true, false)).toBe(false);
  });

  it('suppresses input while no game runs', () => {
    expect(inputSuppressedFor(false, false)).toBe(true);
    expect(inputSuppressedFor(false, true)).toBe(true);
  });
});
