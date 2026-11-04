/* @layer shared-asset-extraction @kind logic */
import { NAME_DEFAULT, CONTROL_TEXT } from './text-codes.constants';

const isNameSubCode = (v: number): boolean => v === 0x0d || v === 0x0e || v === 0x0f || v === 0x1f;

const special = (v: number, namesub: boolean, ind: string): [string, number] => {
  if (v === 0x12) return ['', 1];
  if (v in NAME_DEFAULT) return [namesub ? `\x01${String.fromCharCode(v)}` : (NAME_DEFAULT[v] as string), 0];
  if (namesub && isNameSubCode(v)) return [`\x01${String.fromCharCode(v)}`, 0];
  const t = CONTROL_TEXT[v] ?? '';
  return [t.includes('%s') ? t.replace('%s', ind) : t, 0];
};

export { special };
