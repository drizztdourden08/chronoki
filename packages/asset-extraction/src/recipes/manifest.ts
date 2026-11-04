/* @layer shared-asset-extraction @kind logic */
interface Generator {
  out: string[];
  cmd: string[];
  stdout?: boolean;
  stage?: string;
  status: string;
  recipes?: string[];
  needs?: string[];
}

interface ManifestFile {
  name: string;
  text: string;
}

const baseName = (path: string): string => path.slice(Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\')) + 1);

const orderedGenerators = (files: ManifestFile[]): Generator[] =>
  [...files]
    .sort((a, b) => {
      const ra = baseName(a.name) === 'manifest.json' ? 0 : 1;
      const rb = baseName(b.name) === 'manifest.json' ? 0 : 1;
      return ra - rb || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
    })
    .flatMap((f) => (JSON.parse(f.text) as { generators: Generator[] }).generators);

const stageOf = (g: Generator): string => g.stage ?? 'data';

const recipesNeeded = (gens: Generator[]): string[] => [...new Set(gens.flatMap((g) => g.recipes ?? []))].sort();

export { orderedGenerators, recipesNeeded, stageOf };
export type { Generator, ManifestFile };
