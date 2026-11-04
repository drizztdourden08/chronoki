/* @layer shared-asset-extraction @kind logic */
import { BASE_HEADER } from './pack-headers.constants';

const parseOrder = (names: string[]): string[] => [...names].sort().sort((a, b) => Number(a !== BASE_HEADER) - Number(b !== BASE_HEADER));

export { parseOrder };
