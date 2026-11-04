/* @layer shared-storage @kind logic */
const legacyModeFlag = (mode: unknown): boolean | undefined => {
  if (mode === 'enhanced') return false;
  return mode === 'original' ? true : undefined;
};

export { legacyModeFlag };
