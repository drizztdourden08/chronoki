/* @layer renderer-widgets @kind type */
import type { GameInfoSheet, GameInfoSnapshot, SheetStat } from '@chronoki/game-core';

type PlayerTabProps = { snapshot: GameInfoSnapshot };

type MemberRowProps = { sheet: GameInfoSheet; onResult: (applied: boolean) => void };

type StatValues = Readonly<Record<SheetStat, number>>;

export type { MemberRowProps, PlayerTabProps, StatValues };
