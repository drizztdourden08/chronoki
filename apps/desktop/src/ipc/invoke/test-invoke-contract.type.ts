/* @layer shared-types @kind types */
import type { EventLogEntry } from '../event-log-entry.type';
import type { TestArgs } from '../test-args.type';
import type { InvokeResult } from './invoke-result.type';

interface TestInvokeContract {
  'test:getArgs': () => Promise<TestArgs>;
  'eventLog:append': (event: EventLogEntry) => Promise<InvokeResult>;
}

export type { TestInvokeContract };
