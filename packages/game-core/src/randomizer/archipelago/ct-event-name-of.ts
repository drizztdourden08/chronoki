/* @layer bridge-wasm @kind logic */
import { CT_EVENT_NAME_PREFIX } from './ct-event-name.constants';

const ctEventNameOf = (key: string): string => `${CT_EVENT_NAME_PREFIX}${key}`;

export { ctEventNameOf };
