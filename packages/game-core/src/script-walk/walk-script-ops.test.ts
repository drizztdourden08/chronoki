/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { walkScriptOps } from './walk-script-ops';

const HEADER = 96;

const syntheticScript = (): Uint8Array => {
  const pointers = new Array<number>(3 * 16).fill(0);
  pointers[0] = HEADER;
  pointers[1] = HEADER + 2;
  pointers[16] = HEADER + 4;
  pointers[32 + 3] = HEADER + 5;
  const table = pointers.flatMap((p) => [p & 0xff, p >> 8]);
  const body = [0xca, 0x0a, 0xca, 0xd7, 0x00, 0x00];
  return Uint8Array.from([3, ...table, ...body]);
};

describe('walkScriptOps', () => {
  it('reports object, function index, raw offset, op and length for each op', { tags: ['critical'] }, () => {
    expect(walkScriptOps(syntheticScript())).toEqual([
      { object: 0, fn: 0, at: 97, op: 0xca, length: 2 },
      { object: 0, fn: 1, at: 99, op: 0xca, length: 2 },
      { object: 1, fn: 0, at: 101, op: 0x00, length: 1 },
      { object: 2, fn: 3, at: 102, op: 0x00, length: 1 },
    ]);
  });
});
