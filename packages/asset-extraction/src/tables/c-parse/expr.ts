/* @layer shared-asset-extraction @kind logic */
import { PackError } from '../pack-error';
import type { PackToken } from '../pack.type';
import { unescape } from './unescape';

type DefineMap = Map<string, PackToken[]>;

const PREC: string[][] = [['|'], ['^'], ['&'], ['<<', '>>'], ['+', '-'], ['*', '/', '%']];
const MAX_DEPTH = 50;

const applyOp = (op: string, v: bigint, r: bigint): bigint => {
  if (op === '|') return v | r;
  if (op === '^') return v ^ r;
  if (op === '&') return v & r;
  if (op === '<<') return v << r;
  if (op === '>>') return v >> r;
  if (op === '+') return v + r;
  if (op === '-') return v - r;
  if (op === '*') return v * r;
  return op === '/' ? v / r : v % r;
};

/** A C integer literal: hex, a leading 0 meaning octal, else decimal; u/l suffixes dropped. */
const numberValue = (s: string): bigint => {
  const digits = s.replace(/[uUlL]+$/, '');
  return /^0\d+$/.test(digits) ? BigInt(`0o${digits.slice(1)}`) : BigInt(digits);
};

/**
 * pack_tables.py Expr.value(): an integer constant expression over the headers' object-like #defines
 * (C precedence for | ^ & << >> + - * / % ?: and unary - + ~ !), evaluated exactly (arbitrary precision,
 * division truncating toward zero as C's does).
 */
const evaluateExpr = (defines: DefineMap, toks: PackToken[], context = '', depth = 0): bigint => {
  let i = 0;
  const peek = (): string | null => (i < toks.length ? toks[i].text : null);
  const take = (): PackToken => {
    if (i >= toks.length) throw new PackError(`${context}: unexpected end of an expression`);
    i += 1;
    return toks[i - 1];
  };

  const primary = (): bigint => {
    const { kind, text } = take();
    if (text === '(') {
      const v = cond();
      if (take().text !== ')') throw new PackError('missing )');
      return v;
    }
    if (kind === 'num') return numberValue(text);
    if (kind === 'chr') {
      const b = unescape(text.slice(1, -1));
      if (b.length !== 1) throw new PackError(`multi-char literal ${text}`);
      return BigInt(b[0]);
    }
    const sub = kind === 'id' ? defines.get(text) : undefined;
    if (sub !== undefined) {
      if (depth + 1 > MAX_DEPTH) throw new PackError(`recursive #define ${text}`);
      return evaluateExpr(defines, sub, text, depth + 1);
    }
    throw new PackError(`unknown token in an expression: ${text}`);
  };

  const unary = (): bigint => {
    const op = peek();
    if (op !== '-' && op !== '+' && op !== '~' && op !== '!') return primary();
    take();
    const v = unary();
    if (op === '-') return -v;
    if (op === '+') return v;
    return op === '~' ? ~v : v === 0n ? 1n : 0n;
  };

  const binary = (level: number): bigint => {
    if (level === PREC.length) return unary();
    let v = binary(level + 1);
    while (PREC[level].includes(peek() ?? '')) {
      const op = take().text;
      v = applyOp(op, v, binary(level + 1));
    }
    return v;
  };

  const cond = (): bigint => {
    const v = binary(0);
    if (peek() !== '?') return v;
    take();
    const a = cond();
    if (take().text !== ':') throw new PackError('bad ?:');
    const b = cond();
    return v !== 0n ? a : b;
  };

  const value = cond();
  if (i !== toks.length) throw new PackError(`${context}: cannot evaluate ${JSON.stringify(toks.map((x) => x.text).join(' '))}`);
  return value;
};

export { evaluateExpr };
export type { DefineMap };
