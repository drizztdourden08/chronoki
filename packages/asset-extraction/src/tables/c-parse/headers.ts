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

const decodeHeader = (bytes: Uint8Array): string => {
  let text = '';
  for (let i = 0; i < bytes.length; i += 4096) text += String.fromCharCode(...bytes.subarray(i, i + 4096));
  return text.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
};

interface Headers {
  tables: PackTable[];
  passthrough: DeclSink['passthrough'];
  evalConst: ConstEval;
  defines: DefineMap;
  typedefs: Map<string, CType>;
  texts: Map<string, string>;
  parseFile: (bytes: Uint8Array, header: string) => void;
  numericDefines: () => PackDefine[];
}

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
