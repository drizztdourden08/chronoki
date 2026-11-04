/* @layer renderer-lib @kind types */
type ImportKind = 'rom';

type ImportPhase = 'extract' | 'copy';

interface ImportReport {
  phase: (phase: ImportPhase, message?: string) => void;
}

interface ImportJobParams<Result> {
  kind: ImportKind;
  title: string;
  work: (report: ImportReport) => Promise<Result>;
  failureOf?: (result: Result) => string | null;
}

export type { ImportJobParams, ImportKind, ImportPhase, ImportReport };
