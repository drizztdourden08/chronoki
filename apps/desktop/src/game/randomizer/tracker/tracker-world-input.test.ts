/* @layer bridge-wasm @kind test */
import type { CtPlacement } from '@chronoki/game-core';
import { createCtWorldDef } from '@chronoki/game-core';
import { describe, expect, it } from 'vitest';
import { trackerWorldInput } from './tracker-world-input';

const placementOf = (startParty?: CtPlacement['startParty']): CtPlacement => ({ startParty } as CtPlacement);

describe('trackerWorldInput', () => {
  it('carries the start party the seed was rolled with', () => {
    expect(trackerWorldInput(placementOf(['crono', 'robo'])).startParty).toEqual(['crono', 'robo']);
  });

  it('puts a recruit gated character in logic at start for a non-legacy party', () => {
    const gated = createCtWorldDef(trackerWorldInput(placementOf(['crono', 'marle']))).eventRules.get('robo');
    const started = createCtWorldDef(trackerWorldInput(placementOf(['crono', 'robo']))).eventRules.get('robo');
    expect(gated).toBeDefined();
    expect(started).not.toEqual(gated);
  });
});
