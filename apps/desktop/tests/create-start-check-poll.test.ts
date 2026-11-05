/* @layer tests @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MemoryView } from '@drizztdourden08/brock-randomizer/memory';
import { createStartCheckPoll } from '@app/game/randomizer/create-start-check-poll';
import { START_CHECK_MAX_POLLS } from '@app/game/randomizer/chronoki-poll-hooks.constants';

const state = vi.hoisted((): { logged: string[]; loud: string[] } => ({ logged: [], loud: [] }));

vi.mock('@drizztdourden08/brock-randomizer/session', () => ({ appRandomizerLog: (line: string) => state.logged.push(line) }));
vi.mock('@app/game/randomizer/report-start-mismatch', () => ({ reportStartMismatch: (line: string) => state.loud.push(line) }));

const VIEW: MemoryView = { byte: () => 0, word: () => 0 };

const checkOf = (settled: () => boolean, matches: boolean) => ({
  settled, matches: () => matches, read: () => (matches ? 'ok line' : 'MISMATCH line'),
});

describe('createStartCheckPoll', { tags: ['critical'] }, () => {
  beforeEach(() => {
    state.logged = [];
    state.loud = [];
  });

  it('waits for the warp to land before reading, then logs a match without a toast', () => {
    let landed = false;
    const poll = createStartCheckPoll(checkOf(() => landed, true));
    poll.poll(VIEW, true);
    expect(state.logged).toEqual([]);
    landed = true;
    poll.poll(VIEW, true);
    poll.poll(VIEW, true);
    expect(state.logged).toEqual(['ok line']);
    expect(state.loud).toEqual([]);
  });

  it('never reads a loaded save (not a fresh New Game)', () => {
    const poll = createStartCheckPoll(checkOf(() => true, false));
    poll.poll(VIEW, false);
    expect(state.logged).toEqual([]);
    expect(state.loud).toEqual([]);
  });

  it('reports a mismatch loudly when the warp never lands', () => {
    const poll = createStartCheckPoll(checkOf(() => false, false));
    for (let i = 0; i < START_CHECK_MAX_POLLS; i += 1) poll.poll(VIEW, true);
    expect(state.loud).toEqual(['MISMATCH line']);
    expect(state.logged).toEqual([]);
  });
});
