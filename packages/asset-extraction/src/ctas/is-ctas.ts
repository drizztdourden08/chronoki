/* @layer shared-asset-extraction @kind logic */
import { CTAS_MAGIC } from './ctas.constants';

const isCtas = (data: Uint8Array): boolean => CTAS_MAGIC.every((b, i) => data[i] === b);

export { isCtas };
