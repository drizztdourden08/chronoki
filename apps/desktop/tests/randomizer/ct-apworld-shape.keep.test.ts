/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { ctFillWorldOf, ctPreRolledOf, ctWidestChecks, ctWidestWorld } from '@chronoki/game-core/archipelago';
import type { CtWorldInput } from '@chronoki/game-core';
import { treeShapeDiff } from '@drizztdourden08/brock-randomizer/test-kit';
import { CT_SHAPE_CASES, CT_SHAPE_PENDING_CASES } from './ct-apworld-shape.cases';
import type { CtShapeCase } from './ct-apworld-shape.cases';

const SEEDS_PER_CASE = 3;

const inputOf = ({ options }: CtShapeCase, seed: string): CtWorldInput => ({ checks: ctWidestChecks(), options, fillerSeed: seed });
const seedsOf = ({ seed }: CtShapeCase): string[] => Array.from({ length: SEEDS_PER_CASE }, (_, index) => `${seed}-${index + 1}`);

const shapeDiffOf = (shape: CtShapeCase, seed: string): string[] =>
  treeShapeDiff(ctWidestWorld(), ctFillWorldOf(inputOf(shape, seed), seed).world);

describe('the exported trees keep one shape per location, exit, event and the start', { tags: ['critical'] }, () => {
  for (const shape of CT_SHAPE_CASES) {
    it(`${shape.name} matches the widest world on ${SEEDS_PER_CASE} seeds`, () => {
      for (const seed of seedsOf(shape)) expect(shapeDiffOf(shape, seed), `${shape.name} ${seed}`).toEqual([]);
    });
  }

  // until C2/C3 (I-155)
  describe.skip('pending cases', () => {
    for (const shape of CT_SHAPE_PENDING_CASES) {
      it(`${shape.name} matches the widest world on ${SEEDS_PER_CASE} seeds`, () => {
        for (const seed of seedsOf(shape)) expect(shapeDiffOf(shape, seed), `${shape.name} ${seed}`).toEqual([]);
      });
    }
  });

  it('balances every present location against one item', () => {
    for (const shape of CT_SHAPE_CASES) {
      for (const seed of seedsOf(shape)) {
        const model = ctPreRolledOf(inputOf(shape, seed), seed).world;
        const pooled = Object.values(model.pool).reduce((sum, count) => sum + count, 0);
        const spoken = pooled + model.dungeonItems.length + Object.keys(model.locked).length;
        expect(spoken, `${shape.name} ${seed}`).toBe(model.present.length);
      }
    }
  });
});
