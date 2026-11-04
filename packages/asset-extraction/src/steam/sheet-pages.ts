/* @layer shared-asset-extraction @kind logic */
import { MULTI_PAGES } from './steam-sheets.constants';

const sheetPages = (loc: number): [number, string][] => {
  const count = MULTI_PAGES[loc];
  const pages: [number, string][] =
    count === undefined
      ? [[2, `cgext${loc}.bin`]]
      : Array.from({ length: count }, (_, k) => [2 + k, `cgext${loc}_${k}.bin`] as [number, string]);
  if (loc === 0x1c || loc === 0x15b) pages.push([1, 'cg_bg.bin']);
  if ((loc >= 0x15a && loc <= 0x15e) || (loc >= 0x1c8 && loc <= 0x1cb)) pages.push([2, 'cgext_lavos.bin']);
  return pages;
};

export { sheetPages };
