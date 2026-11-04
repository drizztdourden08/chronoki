/* @layer renderer-appshell @kind types */
import type { activeGameHolder, chronokiCore } from '@app/game/lifecycle';

type ActiveGame = NonNullable<typeof activeGameHolder.current>;

type SramProbeContext = {
  fs: NonNullable<ReturnType<typeof chronokiCore.fs>>;
  profileId: string;
  files: ActiveGame['files'];
  store: ActiveGame['store'];
};

type PatternWrite = { pattern: Uint8Array; patternStored: boolean; errors: string[] };

export type { PatternWrite, SramProbeContext };
