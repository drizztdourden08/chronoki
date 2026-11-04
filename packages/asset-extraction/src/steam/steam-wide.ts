/* @layer shared-asset-extraction @kind logic */
import { writeCtWide } from './ct-wide-writer';
import type { ResolvedMargin } from './ct-wide-writer';
import { halve, pngRgba } from './steam-image';
import { readDirectory, readEntry } from './steam-archive';
import type { SteamArchive, SteamFiles } from './steam-archive';
import { readMargins } from './steam-margins';
import type { Margin } from './steam-margins';
import { chipSet, pixelSheet, steamPalette } from './steam-sheets';

/** The special scenes' extension art the port draws, halved to the SNES's pixels (the Epoch's cockpit walls, sequence entry 6). */
const SPECIAL = ['Game/special/into_lavos/40_kokscr_ext.png'];

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

/** The chip sets the margins' slots name, each once; a set the archive lacks is dropped. */
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

/** Each pixel sheet once; a location names its pages by sheet index, a later entry for a page replacing an earlier one. */
const resolvePages = async (archive: SteamArchive, files: SteamFiles, margins: Map<number, Margin>) => {
  const sheets: Uint8Array[] = [];
  const index = new Map<string, number | null>();
  const resolved = new Map<number, ResolvedMargin>();
  for (const [loc, m] of margins) {
    let pages: [number, number][] = [];
    for (const [pg, name] of m.pages) {
      if (!index.has(name)) {
        const px = await pixelSheet(archive, files, name);
        index.set(name, px ? sheets.length : null);
        if (px) sheets.push(px);
      }
      const at = index.get(name);
      if (at !== null && at !== undefined) pages = [...pages.filter((p) => p[0] !== pg), [pg, at]];
    }
    resolved.set(loc, { ...m, pages });
  }
  return { sheets, resolved };
};

/** tools/steam_wide.py: the Steam release's widescreen margins, read from the player's own copy, as the bytes of ct_wide.dat. */
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
