/* @layer bridge-wasm @kind test */
import { createRng, worldGameFromDef } from '@drizztdourden08/brock-randomizer/world';
import { describe, expect, it } from 'vitest';
import type { CheckDef } from '../../checks/check.type';
import { createCtWorldDef } from '../create-ct-world-def';
import { CT_KIT } from '../ct-kit.constants';
import { ctOptionValues } from '../ct-option-values';
import type { CtOptionValues, CtWorldInput } from '../ct-world-input.type';
import type { CtEventId, CtItem } from '../ct-world-keys.type';
import { PINNED_SOURCES } from '../pinned-sources.constants';
import { STORY_STAGES } from './story-stages.constants';
import { storyRuleOf } from './story-rule-of';
import { STORY_WRITERS } from './story-writers.constants';

const { any, region } = CT_KIT;

const gift = (id: string, locationId: number, vanillaItem: number): CheckDef => ({ id, kind: 'gift', locationId, vanillaItem });

const GIFTS: readonly CheckDef[] = [
  gift('gift-004-o8-1', 0x004, 0x8b),
  gift('gift-004-o8-2', 0x004, 0x79),
  gift('gift-02f-o12-0', 0x02f, 0x9f),
  gift('gift-087-o13', 0x087, 0x80),
  gift('gift-014-o99', 0x014, 0x9a),
];

const inputOf = (options: CtOptionValues = {}): CtWorldInput => ({ checks: GIFTS, options });

const stateOf = (input: CtWorldInput, held: readonly (CtItem | CtEventId)[]) => {
  const game = worldGameFromDef({ ...createCtWorldDef(input), options: () => ({ ...ctOptionValues(), ...input.options }) });
  const { world } = game.build({ request: { seed: 'story' }, prep: undefined, rng: createRng('story'), attempt: 0 });
  const state = CT_KIT.createCollectionState(world);
  held.forEach((item) => state.collect(item));
  return state;
};

const canGet = (input: CtWorldInput, held: readonly (CtItem | CtEventId)[], key: string): boolean =>
  CT_KIT.canCollectLocation(stateOf(input, held), key);

describe('story stages', { tags: ['critical'] }, () => {
  it('meets a stage through any scene that writes that stage or a later one', () => {
    expect(storyRuleOf(STORY_STAGES.oceanPalace)).toEqual(any(region('ocean-palace')));
    const rules = STORY_WRITERS.map((writer) => writer.rule);
    expect(storyRuleOf(STORY_STAGES.heckran)).toEqual(any(...rules));
    expect(storyRuleOf(STORY_STAGES.masamune)).toEqual(any(...rules.slice(1)));
  });

  it('gives Gaspar the Chrono Trigger only at the Ocean Palace stage', () => {
    expect(PINNED_SOURCES.find((source) => source.key === 'gift-1d0-o0')?.rule).toEqual(storyRuleOf(STORY_STAGES.oceanPalace));
  });

  it('opens Taban from the start and his later gifts only at their stage', () => {
    expect(canGet(inputOf(), [], 'ki-taban')).toBe(true);
    expect(canGet(inputOf(), [], 'gift-004-o8-1')).toBe(false);
    expect(canGet(inputOf(), ['masamune'], 'gift-004-o8-1')).toBe(true);
    expect(canGet(inputOf(), [], 'gift-004-o8-2')).toBe(false);
    expect(canGet(inputOf(), ['pendant'], 'gift-004-o8-2')).toBe(true);
  });

  it('needs flight for the Keeper\'s Dome stage under Epoch Fail', () => {
    expect(canGet(inputOf({ epochFail: true }), ['pendant'], 'gift-004-o8-2')).toBe(false);
    expect(canGet(inputOf({ epochFail: true }), ['pendant', 'jets-of-time'], 'gift-004-o8-2')).toBe(true);
  });

  it('holds the Dark Ages gifts until the Dark Ages, and leaves ungated gifts open', () => {
    expect(canGet(inputOf(), [], 'gift-02f-o12-0')).toBe(false);
    expect(canGet(inputOf(), ['gate-key'], 'gift-02f-o12-0')).toBe(true);
    expect(canGet(inputOf(), [], 'gift-014-o99')).toBe(true);
  });

  it('keeps key items off gifts with a story window, even with chronosanity', () => {
    const rules = createCtWorldDef(inputOf({ chronosanity: true })).itemRules;
    expect(rules?.get('gift-087-o13')?.('pendant')).toBe(false);
    expect(rules?.get('gift-087-o13')?.('treasure-10')).toBe(true);
    expect(rules?.get('gift-004-o8-2')).toBeUndefined();
  });
});
