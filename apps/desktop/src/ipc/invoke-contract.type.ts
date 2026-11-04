/* @layer shared-types @kind types */
import type { SteamInvokeContract } from './invoke/steam-invoke-contract.type';
import type { TestInvokeContract } from './invoke/test-invoke-contract.type';

interface InvokeContract extends TestInvokeContract, SteamInvokeContract {}

export type { InvokeContract };
