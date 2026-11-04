/* @layer renderer-lib @kind logic */
const releaseFocus = (): void => {
  const el = document.activeElement;
  if (el instanceof HTMLElement && el !== document.body) el.blur();
};

export { releaseFocus };
