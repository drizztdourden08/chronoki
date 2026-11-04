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

export type { HeroLastSave, HeroToolsProps };
