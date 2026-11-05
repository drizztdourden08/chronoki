/* @layer renderer-components @kind logic */
import type { CtOptionValues } from '@chronoki/game-core';
import { ctUiOptions } from '@chronoki/game-core';
import { SCOPE_EXCLUDED, SCOPE_SECTION } from './ct-settings.constants';
import type { CtScopeFlag } from './ct-scope-flag.type';

const ctScopeFlagsOf = (values: CtOptionValues): readonly CtScopeFlag[] =>
  ctUiOptions()
    .filter((option) => option.section === SCOPE_SECTION && typeof option.default === 'boolean' && option.implemented
      && !SCOPE_EXCLUDED.includes(option.key))
    .map((option) => ({ id: option.key, label: option.label, on: values[option.key] === true }));

export { ctScopeFlagsOf };
