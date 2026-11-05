/* @layer renderer-lib @kind types */
type ImportKind = 'rom' | 'sprites';

type ImportPhase = 'download' | 'extract' | 'copy';

interface ImportReport {
  phase: (phase: ImportPhase, message?: string) => void;
  count: (phase: ImportPhase, loaded: number, total?: number) => void;
}

interface ImportJobParams<Result> {
  kind: ImportKind;
  title: string;
  work: (report: ImportReport) => Promise<Result>;
  failureOf?: (result: Result) => string | null;
}

export type { ImportJobParams, ImportKind, ImportPhase, ImportReport };
