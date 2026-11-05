/* @layer bridge-wasm @kind logic */
import type { CtModeDef, CtModeId } from './ct-mode-def.type';
import { STANDARD_MODE } from './standard-mode.constants';

const stubModeOf = (id: CtModeId, label: string, overrides: Partial<CtModeDef> = {}): CtModeDef =>
  ({ ...STANDARD_MODE, id, label, implemented: false, ...overrides });

export { stubModeOf };
