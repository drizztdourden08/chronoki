/* @layer electron-main @kind types */
interface DirItem {
  name: string;
  isDirectory: boolean;
  isLink: boolean;
}

interface ScanFs {
  readDir: (dir: string) => Promise<DirItem[]>;
  isFile: (path: string) => Promise<boolean>;
  readText: (path: string) => Promise<string | null>;
}

interface ScanControl {
  visits: number;
  cancelled: boolean;
  limit: number;
}

export type { DirItem, ScanControl, ScanFs };
