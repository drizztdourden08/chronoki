/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { archivePathOf } from '../electron/steam-detect/archive-path-of';
import { detectSteamArchive } from '../electron/steam-detect/detect-steam-archive';
import { isSkippedFolder } from '../electron/steam-detect/is-skipped-folder';
import { isSteamRoot } from '../electron/steam-detect/is-steam-root';
import { parseLibraryFolders } from '../electron/steam-detect/parse-library-folders';
import { parseRegistryValue } from '../electron/steam-detect/parse-registry-value';
import type { DirItem, ScanFs } from '../electron/steam-detect/steam-detect.type';
import { walkDrive } from '../electron/steam-detect/walk-drive';

type Tree = { [name: string]: Tree | string | { symlinkTo: string } };

const nodeAt = (tree: Tree, path: string): Tree | string | { symlinkTo: string } | undefined => {
  const parts = path.split('\\').filter((part) => part !== '' && !/^[A-Z]:$/.test(part));
  let node: Tree | string | { symlinkTo: string } | undefined = tree;
  for (const part of parts) {
    if (typeof node !== 'object' || 'symlinkTo' in node) return undefined;
    node = node[part];
  }
  return node;
};

const fsOf = (tree: Tree): ScanFs => ({
  readDir: (dir) => {
    const node = nodeAt(tree, dir);
    if (typeof node !== 'object' || 'symlinkTo' in node) return Promise.reject(new Error('not a folder'));
    return Promise.resolve(Object.entries(node).map(([name, child]): DirItem => ({ name, isDirectory: typeof child === 'object', isLink: typeof child === 'object' && 'symlinkTo' in child })));
  },
  isFile: (path) => Promise.resolve(typeof nodeAt(tree, path) === 'string'),
  readText: (path) => {
    const node = nodeAt(tree, path);
    return Promise.resolve(typeof node === 'string' ? node : null);
  },
});

const GAME: Tree = { steamapps: { common: { 'Chrono Trigger': { 'resources.bin': 'x' } } } };

describe('steam detection, pure parts', { tags: ['critical'] }, () => {
  it('joins the standard archive path', () => {
    expect(archivePathOf('D:\\SteamLibrary')).toBe('D:\\SteamLibrary\\steamapps\\common\\Chrono Trigger\\resources.bin');
    expect(archivePathOf('c:\\program files (x86)\\steam\\')).toBe('c:\\program files (x86)\\steam\\steamapps\\common\\Chrono Trigger\\resources.bin');
  });

  it('parses the library folders vdf', () => {
    const vdf = '"libraryfolders"\n{\n\t"0"\n\t{\n\t\t"path"\t\t"C:\\\\Program Files (x86)\\\\Steam"\n\t\t"label"\t\t""\n\t}\n\t"1"\n\t{\n\t\t"path"\t\t"E:\\\\Games\\\\SteamLibrary"\n\t}\n}\n';
    expect(parseLibraryFolders(vdf)).toEqual(['C:\\Program Files (x86)\\Steam', 'E:\\Games\\SteamLibrary']);
    expect(parseLibraryFolders('garbage')).toEqual([]);
  });

  it('reads a registry value', () => {
    expect(parseRegistryValue('\r\nHKEY_CURRENT_USER\\Software\\Valve\\Steam\r\n    SteamPath    REG_SZ    c:/program files (x86)/steam\r\n')).toBe('c:/program files (x86)/steam');
    expect(parseRegistryValue('ERROR: not found')).toBeNull();
  });

  it('skips system folders, dot folders, links and files', () => {
    const folder = (name: string, extra: Partial<DirItem> = {}): DirItem => ({ name, isDirectory: true, isLink: false, ...extra });
    expect(isSkippedFolder(folder('Windows'))).toBe(true);
    expect(isSkippedFolder(folder('$Recycle.Bin'))).toBe(true);
    expect(isSkippedFolder(folder('System Volume Information'))).toBe(true);
    expect(isSkippedFolder(folder('node_modules'))).toBe(true);
    expect(isSkippedFolder(folder('.git'))).toBe(true);
    expect(isSkippedFolder(folder('Games', { isLink: true }))).toBe(true);
    expect(isSkippedFolder(folder('readme', { isDirectory: false }))).toBe(true);
    expect(isSkippedFolder(folder('Games'))).toBe(false);
  });

  it('recognises a Steam root by name or by steamapps', () => {
    expect(isSteamRoot('Steam', [])).toBe(true);
    expect(isSteamRoot('SteamLibrary', [])).toBe(true);
    expect(isSteamRoot('Documents', [{ name: 'SteamApps', isDirectory: true, isLink: false }])).toBe(true);
    expect(isSteamRoot('Documents', [])).toBe(false);
  });
});

describe('steam detection, walking a synthetic drive', { tags: ['critical'] }, () => {
  it('finds a library at any depth', async () => {
    const tree: Tree = { Games: { Deep: { More: { Archive: { Library: GAME } } } } };
    const control = { visits: 0, cancelled: false, limit: 1000 };
    expect(await walkDrive('D:\\', fsOf({ Games: { Deep: { More: { Archive: { SteamLibrary: GAME } } } } }), control)).toBe(
      'D:\\Games\\Deep\\More\\Archive\\SteamLibrary\\steamapps\\common\\Chrono Trigger\\resources.bin',
    );
    expect(await walkDrive('D:\\', fsOf(tree), { visits: 0, cancelled: false, limit: 1000 })).toBe(
      'D:\\Games\\Deep\\More\\Archive\\Library\\steamapps\\common\\Chrono Trigger\\resources.bin',
    );
  });

  it('does not enter skipped folders or links', async () => {
    const tree: Tree = { Windows: { Steam: GAME }, node_modules: { Steam: GAME }, '.hidden': { Steam: GAME }, Linked: { symlinkTo: 'D:\\Elsewhere' } };
    expect(await walkDrive('D:\\', fsOf(tree), { visits: 0, cancelled: false, limit: 1000 })).toBeNull();
  });

  it('stops at the visit cap and when cancelled', async () => {
    const tree: Tree = { A: { B: { C: { Steam: GAME } } } };
    const capped = { visits: 0, cancelled: false, limit: 2 };
    expect(await walkDrive('D:\\', fsOf(tree), capped)).toBeNull();
    expect(capped.visits).toBe(2);
    const cancelled = { visits: 0, cancelled: true, limit: 1000 };
    expect(await walkDrive('D:\\', fsOf(tree), cancelled)).toBeNull();
    expect(cancelled.visits).toBe(0);
  });

  it('checks the registry root and its library list before walking', async () => {
    const tree: Tree = {
      Steam: { steamapps: { 'libraryfolders.vdf': '"path"\t\t"E:\\\\Lib"' } },
      Lib: GAME,
    };
    const fs = fsOf(tree);
    const control = { visits: 0, cancelled: false, limit: 1000 };
    const found = await detectSteamArchive(['C:\\Steam'], [], { ...fs, isFile: (path) => path.startsWith('E:\\Lib') ? fs.isFile(path.replace('E:\\Lib', 'Lib')) : fs.isFile(path) }, control);
    expect(found).toBe('E:\\Lib\\steamapps\\common\\Chrono Trigger\\resources.bin');
    expect(control.visits).toBe(0);
  });
});
