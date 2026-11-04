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

export type { HeroLastSave, HeroProgressFile, HeroToolsProps };
