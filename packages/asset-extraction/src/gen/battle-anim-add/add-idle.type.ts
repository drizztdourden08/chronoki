/* @layer shared-asset-extraction @kind types */
import type { PeekDump, MonitorRequest } from '../../oracle/peek.type';

type SavingDump = PeekDump & { state?: Uint8Array };
type PokeMonitorRequest = MonitorRequest & { env?: Record<string, string> };

export type { SavingDump, PokeMonitorRequest };
