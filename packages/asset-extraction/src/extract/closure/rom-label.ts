/* @layer shared-asset-extraction @kind logic */

const romLabel = (offset: number): string =>
  `$${(0xc0 + (offset >> 16)).toString(16).toUpperCase().padStart(2, '0')}:${(offset & 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;

export { romLabel };
