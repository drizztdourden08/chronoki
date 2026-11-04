/* @layer shared-asset-extraction @kind logic */
import type { Generator, ManifestFile } from './manifest.type';

const baseName = (path: string): string => path.slice(Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\')) + 1);

const orderedGenerators = (files: ManifestFile[]): Generator[] =>
  [...files]
    .sort((a, b) => {
      const ra = baseName(a.name) === 'manifest.json' ? 0 : 1;
      const rb = baseName(b.name) === 'manifest.json' ? 0 : 1;
      return ra - rb || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    })
    .flatMap((f) => (JSON.parse(f.text) as { generators: Generator[] }).generators);

export { orderedGenerators };
