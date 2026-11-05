/* @layer renderer-widgets @kind type */
import type { SeedCheckRow } from '@app/game/cheats';

type ChecksTabProps = { rows: readonly SeedCheckRow[] };

type CheckEntryProps = { row: SeedCheckRow; onResult: (applied: boolean) => void };

export type { CheckEntryProps, ChecksTabProps };
