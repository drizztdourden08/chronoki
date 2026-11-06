/* @layer bridge-wasm @kind logic */
import { applyBucketToRegions } from './bucket/apply-bucket-to-regions';
import { bucketCountsOf } from './bucket/bucket-counts-of';
import { objectivesOf } from './bucket/objectives-of';
import type { CtWorldInput } from './ct-world-input.type';
import type { SpecsContext } from './ct-world-specs-of.type';
import type { CtWorldSpecs } from './ct-world-specs.type';
import { applyEpochFailToRegions } from './epoch-fail/apply-epoch-fail-to-regions';
import { applyModeToRegions } from './modes/apply-mode-to-regions';
import { applyStartPartyToRegions } from './recruits/apply-start-party-to-regions';
import { CT_REGIONS } from './regions/ct-regions.constants';
import { shapeRegionsOf } from './shape/shape-regions';
import { SHAPE_MENU_REGION } from './shape/shape.constants';

const ctWorldSpecsOf = (input: CtWorldInput, context: SpecsContext): CtWorldSpecs => {
  const { mode, options, party, duplicate } = context;
  const shaped = input.shape === 'one';
  const modeKept = applyModeToRegions(CT_REGIONS, mode);
  const start = shaped ? SHAPE_MENU_REGION : mode.start;
  const epoched = applyEpochFailToRegions(shaped ? shapeRegionsOf() : modeKept);
  const partied = shaped
    ? epoched
    : applyStartPartyToRegions(epoched, start, party, { assignment: input.characters, duplicate });
  const objectives = objectivesOf(input.options, input.fillerSeed ?? '', party);
  const { needed } = bucketCountsOf(options, objectives.length);
  const specs = shaped ? partied : applyBucketToRegions(partied, objectives, needed);
  return { specs, scope: shaped ? modeKept : specs, start, objectives, needed };
};

export { ctWorldSpecsOf };
