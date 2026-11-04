/* @layer shared-asset-extraction @kind logic */
import type { CType } from '../c-type.type';
import type { ConstEval, PackDefine } from '../pack.type';
import { PackError } from '../pack-error';
import type { TableAbi } from '../table-abi.type';
import { parseDeclaration } from './declaration';
import type { DeclSink } from './declaration.type';
import { evaluateExpr } from './expr';
import type { DefineMap } from './expr.type';
import { tokenize } from './tokenize';
import { blankDirectives } from './preprocess';
import type { DefineLog } from './preprocess.type';
import { stripComments } from './strip-comments';
import { createCursor } from './token-cursor';
import type { Headers } from './headers.type';
import { decodeHeader } from './decode-header';

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

export { createHeaders };
