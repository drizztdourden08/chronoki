/* @layer renderer-components @kind logic */
import type { RunTile } from '@drizztdourden08/brock-randomizer/renderer';
import { tallyTile } from '@drizztdourden08/brock-randomizer/renderer';
import type { CtOptionValues } from '@chronoki/game-core';
import { ctUiOptions } from '@chronoki/game-core';
import { ctScopeFlagsOf } from './ct-scope-flags-of';
import { SETTING_TILES } from './ct-settings.constants';

const ctSettingsTilesOf = (values: CtOptionValues): RunTile[] => {
  const options = ctUiOptions();
  const changeable = options.filter((option) => option.implemented && option.frozen !== true);
  const flags = ctScopeFlagsOf(values);
  const labelOf = (key: keyof CtOptionValues): string => {
    const option = options.find((each) => each.key === key);
    const value = String(values[key] ?? option?.default ?? '');
    return option?.choiceLabels?.[value] ?? value;
  };
  return [
    tallyTile('Options changed', {
      count: changeable.filter((option) => values[option.key] !== option.default).length,
      total: changeable.length,
    }),
    tallyTile('Shuffle scopes', { count: flags.filter((flag) => flag.on).length, total: flags.length }),
    ...SETTING_TILES.map(({ key, label }) => ({ label, value: labelOf(key) })),
  ];
};

export { ctSettingsTilesOf };
