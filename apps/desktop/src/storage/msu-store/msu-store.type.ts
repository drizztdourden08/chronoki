/* @layer renderer-lib @kind types */
interface MsuSourceFile {
  name: string;
  bytes: Uint8Array;
}

type MsuImportResult =
  | { success: true; pack: string; fileCount: number }
  | { success: false; error: string };

type MsuImportProgress = (done: number, total: number) => void;

export type { MsuImportProgress, MsuImportResult, MsuSourceFile };
