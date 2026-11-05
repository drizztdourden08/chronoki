/* @layer renderer-components @kind types */
interface HeroToolsProps {
  canRevealFolder: boolean;
  importDisabled?: boolean;
  onOpenFolder: () => void;
  onImportSram: () => void;
}

interface HeroLastSave {
  name: string;
  timestamp: number;
  screenshotUrl: string | null;
  busy: boolean;
  onLoad: () => void;
}

interface HeroProgressFile {
  slot: number;
  lead: string;
  level: number;
  playTime: string;
  saveNumber: number;
}

interface HeroChecks {
  taken: number;
  available: number;
  left: number;
  total: number;
}

interface HeroProgressProps {
  files: HeroProgressFile[];
  checks?: HeroChecks | null;
}

export type { HeroChecks, HeroLastSave, HeroProgressFile, HeroProgressProps, HeroToolsProps };
