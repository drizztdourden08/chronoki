/* @layer electron-main @kind logic */
import { REG_LINE } from './parse-registry-value.constants';

const parseRegistryValue = (output: string): string | null => REG_LINE.exec(output)?.[1] ?? null;

export { parseRegistryValue };
