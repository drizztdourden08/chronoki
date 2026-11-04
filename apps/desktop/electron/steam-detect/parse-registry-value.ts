/* @layer electron-main @kind logic */
const REG_LINE = /^\s*\S+\s+REG_(?:EXPAND_)?SZ\s+(.+?)\s*$/m;

const parseRegistryValue = (output: string): string | null => REG_LINE.exec(output)?.[1] ?? null;

export { parseRegistryValue };
