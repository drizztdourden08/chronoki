/* @layer shared-asset-extraction @kind logic */
import { writeCtWide } from './ct-wide-writer';
import type { ResolvedMargin } from './ct-wide-writer.type';
import { pngRgba } from './steam-image';
import { halve } from './halve';
import { readEntry } from './steam-archive';
import { readDirectory } from './read-directory';
import type { SteamArchive, SteamFiles } from './steam-archive.type';
import { readMargins } from './steam-margins';
import type { Margin } from './steam-margins.type';
import { chipSet } from './steam-sheets';
import { steamPalette } from './steam-palette';
import { pixelSheet } from './pixel-sheet';
import { SPECIAL } from './steam-wide.constants';

const specials = async (archive: SteamArchive, files: SteamFiles) => {
  const out = [];
  for (const path of SPECIAL) {
    const entry = files.get(path);
    if (!entry) continue;
    const img = await pngRgba(await readEntry(archive, entry));
    if (img) out.push({ name: path.slice(path.lastIndexOf('/') + 1), ...halve(img) });
  }
  return out;
};

const chipSets = async (archive: SteamArchive, files: SteamFiles, margins: Map<number, Margin>) => {
  const sets = new Map<number, Uint8Array>();
  const seen = new Set<number>();
  for (const m of margins.values()) {
    for (const s of m.slots) {
      if (s === 0xff || seen.has(s)) continue;
      seen.add(s);
      const px = await chipSet(archive, files, s);
      if (px) sets.set(s, px);
    }
  }
  return sets;
};

const resolvePages = async (archive: SteamArchive, files: SteamFiles, margins: Map<number, Margin>) => {
  const sheets: Uint8Array[] = [];
  const index = new Map<string, number | null>();
  const resolved = new Map<number, ResolvedMargin>();
  const indexOfSheet = async (name: string): Promise<number | null | undefined> => {
    if (!index.has(name)) {
      const px = await pixelSheet(archive, files, name);
      index.set(name, px ? sheets.length : null);
      if (px) sheets.push(px);
    }
    return index.get(name);
  };
  for (const [loc, m] of margins) {
    let pages: [number, number][] = [];
    for (const [pg, name] of m.pages) {
      const at = await indexOfSheet(name);
      if (at !== null && at !== undefined) pages = [...pages.filter((p) => p[0] !== pg), [pg, at]];
    }
    resolved.set(loc, { ...m, pages });
  }
  return { sheets, resolved };
};

const buildCtWide = async (archive: SteamArchive): Promise<Uint8Array> => {
  const files = await readDirectory(archive);
  const margins = await readMargins(archive, files);
  const sets = await chipSets(archive, files, margins);
  const { sheets, resolved } = await resolvePages(archive, files, margins);
  const palettes = new Map<number, Uint8Array>();
  for (const [loc, m] of resolved) {
    if (m.pages.length === 0) continue;
    const pal = await steamPalette(archive, files, loc);
    if (pal) palettes.set(loc, pal);
  }
  return writeCtWide({ margins: resolved, sets, sheets, specials: await specials(archive, files), palettes });
};

export { buildCtWide };
