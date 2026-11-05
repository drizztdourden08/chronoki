/* @layer tests @kind test */
import type { CtPlacement } from '@chronoki/game-core';
import { createCtWorldDef } from '@chronoki/game-core';
import { afterEach, describe, expect, it } from 'vitest';
import { localRunHolder } from '@app/game/randomizer/local-run-holder';
import type { AppliedSeed } from '@app/game/randomizer/local-run.type';
import { trackerWorldInput } from '@app/game/randomizer/tracker/tracker-world-input';

const placementOf = (startParty?: CtPlacement['startParty']): CtPlacement => ({ startParty } as CtPlacement);

describe('trackerWorldInput', { tags: ['critical'] }, () => {
  afterEach(() => {
    localRunHolder.applied = null;
  });

  it('carries the start party the seed was rolled with', () => {
    expect(trackerWorldInput(placementOf(['crono', 'robo'])).startParty).toEqual(['crono', 'robo']);
  });

  it('puts a recruit gated character in logic at start for a non-legacy party', () => {
    const gated = createCtWorldDef(trackerWorldInput(placementOf(['crono', 'marle']))).eventRules?.get('robo');
    const started = createCtWorldDef(trackerWorldInput(placementOf(['crono', 'robo']))).eventRules?.get('robo');
    expect(gated).toBeDefined();
    expect(started).not.toEqual(gated);
  });

  it('carries the options and sealed check ids of the applied seed', () => {
    const options = { itemDifficulty: 'hard' };
    const applied: Pick<AppliedSeed, 'checks' | 'options' | 'sealedCheckIds'> = { checks: [], options, sealedCheckIds: ['a', 'b'] };
    localRunHolder.applied = applied as AppliedSeed;
    const input = trackerWorldInput(placementOf());
    expect(input.options).toEqual(options);
    expect(input.sealedCheckIds).toEqual(new Set(['a', 'b']));
  });
});
