/* @layer shared-asset-extraction @kind logic */
import { mashScript } from './mash-script';
import { holdScript } from './hold-script';

const scriptFor = (driver: string, F: number): string => (driver === 'mash' ? mashScript(F) : holdScript(F));

export { scriptFor };
