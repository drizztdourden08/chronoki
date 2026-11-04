/* @layer shared-asset-extraction @kind logic */
import type { CType } from '../c-type.type';
import type { ConstEval, PackDefine, PackTable } from '../pack.type';
import { PackError } from '../pack-error';
import type { TableAbi } from '../table-abi.type';
import { parseDeclaration } from './declaration';
import type { DeclSink } from './declaration';
import { evaluateExpr } from './expr';
import type { DefineMap } from './expr';
import { tokenize } from './lexer';
import { blankDirectives } from './preprocess';
import type { DefineLog } from './preprocess';
import { stripComments } from './strip-comments';
import { createCursor } from './token-cursor';

/** A header's bytes as text: Latin-1 (comments may hold cp1252; literals are checked) with C newlines. */
const decodeHeader = (bytes: Uint8Array): string => {
  let text = '';
  for (let i = 0; i < bytes.length; i += 4096) text += String.fromCharCode(...bytes.subarray(i, i + 4096));
  return text.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
};

interface Headers {
  tables: PackTable[];
  passthrough: DeclSink['passthrough'];
  evalConst: ConstEval;
  /** The #defines by name (their tokens), shared by every header parsed so far. */
  defines: DefineMap;
  /** The typedefs by name. */
  typedefs: Map<string, CType>;
  /** Each header's comment-stripped text, in parse order. */
  texts: Map<string, string>;
  /** Parses one header's bytes into the shared environment. */
  parseFile: (bytes: Uint8Array, header: string) => void;
  /** pack_tables.py numeric_defines(): every #define with a value, as an integer. */
  numericDefines: () => PackDefine[];
}

/**
 * pack_tables.py Headers: every generated header parsed into one environment (the headers share types and
 * #defines: battle_marleatk.h uses battle_anim.h's CtAnimObj). Pointers are laid out for the given target.
 */
const createHeaders = (abi: TableAbi): Headers => {
  const defines: DefineMap = new Map();
  const log: DefineLog = { defines, order: [] };
  const typedefs = new Map<string, CType>();
  const texts = new Map<string, string>();
  const sink: DeclSink = { tables: [], passthrough: [] };
  const evalConst: ConstEval = (tokens, context) => evaluateExpr(defines, tokens, context);

  const parseText = (text: string, header: string): void => {
    const code = blankDirectives(text, header, log);
    const cur = createCursor(tokenize(code, header), header);
    const env = { cur, header, abi, typedefs, evalConst };
    while (!cur.done()) parseDeclaration(env, code, sink);
  };

  const numericDefines = (): PackDefine[] =>
    log.order.flatMap(({ header, name }) => {
      const toks = defines.get(name) ?? [];
      if (toks.length === 0) return [];
      try {
        return [{ header, name, value: evalConst(toks, name) }];
      } catch (e) {
        if (e instanceof PackError) throw new PackError(`${header}: #define ${name} is not an integer constant`);
        throw e;
      }
    });

  return {
    tables: sink.tables,
    passthrough: sink.passthrough,
    evalConst,
    defines,
    typedefs,
    texts,
    parseFile: (bytes, header) => {
      const text = stripComments(decodeHeader(bytes));
      texts.set(header, text);
      parseText(text, header);
    },
    numericDefines,
  };
};

export { createHeaders, decodeHeader };
export type { Headers };
