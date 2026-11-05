/* @layer bridge-wasm @kind logic */
import type { RuleOptionValue } from '@drizztdourden08/brock-randomizer/world';
import type { CtOptionDef } from '../ct-option-def.type';

const pickMysteryValue = (option: CtOptionDef, roll: number): RuleOptionValue => {
  const { mystery } = option;
  if (typeof option.default === 'boolean') return typeof mystery === 'number' ? roll < mystery : option.default;
  if (typeof mystery !== 'object') return option.default;
  const weighted = (option.choices ?? []).map((choice) => ({ choice, weight: Math.max(0, mystery[String(choice)] ?? 0) }))
    .filter((entry) => entry.weight > 0);
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  if (total === 0) return option.default;
  let left = roll * total;
  const hit = weighted.find((entry) => {
    left -= entry.weight;
    return left < 0;
  });
  return (hit ?? weighted[weighted.length - 1])?.choice ?? option.default;
};

export { pickMysteryValue };
