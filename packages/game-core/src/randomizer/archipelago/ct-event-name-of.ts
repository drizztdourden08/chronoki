/* @layer bridge-wasm @kind logic */
import { CT_EVENT_NAMES, CT_EVENT_NAME_PREFIX } from './ct-event-name.constants';

const ctEventNameOf = (key: string): string => `${CT_EVENT_NAME_PREFIX}${CT_EVENT_NAMES[key] ?? key}`;

export { ctEventNameOf };
