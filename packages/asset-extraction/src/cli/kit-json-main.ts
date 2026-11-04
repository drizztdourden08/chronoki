/* @layer shared-asset-extraction @kind logic */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { parseArgs } from 'node:util';
import { loadKitSources } from '../kit/load-kit-sources';
import { errLine } from './err-line';
import { KIT_JSON_USAGE } from './kit-json-main.constants';
import { outLine } from './out-line';

const kitJson = async (argv: string[]): Promise<number> => {
  const { values } = parseArgs({ args: argv, options: { belthasar: { type: 'string' }, out: { type: 'string' } } });
  if (values.belthasar === undefined || values.out === undefined) {
    errLine(KIT_JSON_USAGE);
    return 2;
  }
  const kit = await loadKitSources(values.belthasar);
  await mkdir(dirname(values.out), { recursive: true });
  await writeFile(values.out, JSON.stringify(kit));
  outLine(`kit-json: ${kit.recipeTexts.length} recipes, ${kit.manifests.length} manifests, ${Object.keys(kit.shapes ?? {}).length} shapes -> ${values.out}`);
  return 0;
};

export { kitJson };
