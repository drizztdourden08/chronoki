/* @layer renderer-components @kind types */
interface HeroToolsProps {
  canRevealFolder: boolean;
  importDisabled?: boolean;
  onOpenFolder: () => void;
  onImportSram: () => void;
}

export type { HeroToolsProps };
