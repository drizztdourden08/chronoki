/* @layer renderer-components @kind logic */
const sideSlotClass = (side: 'start' | 'end', collapsed: boolean): string => [
  'controls-settings__side',
  `controls-settings__side--${side}`,
  !collapsed && 'controls-settings__side--open',
].filter(Boolean).join(' ');

export { sideSlotClass };
