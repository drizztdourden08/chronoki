/* @layer shared-asset-extraction @kind logic */
import type { BootRequest, BootResult } from '../../gen/ctgen/oracle-tools.type';
import { tailOf } from './tail-of';
import type { CtRunner } from './ct-runner.type';
import { RAW_OUT, SRAM_IN, STATE_OUT } from './wasm-paths.constants';

const powerOnCall = async (ct: CtRunner, req: BootRequest): Promise<BootResult> => {
  const outcome = await ct({
    args: ['--fb', RAW_OUT, '--frames', String(req.frames)],
    rule: true,
    env: { PEEK_SAVE: STATE_OUT, ...(req.sram ? { CT_ORACLE_SRAM: SRAM_IN } : {}) },
    files: req.sram ? { [SRAM_IN]: req.sram } : {},
    outputs: [RAW_OUT, `${RAW_OUT}.wram`, STATE_OUT],
  });
  const state = outcome.files[STATE_OUT];
  if (!state) throw new Error(`ct.exe --fb wrote no state (exit ${outcome.status})\n${tailOf(outcome)}`);
  const fb = outcome.files[RAW_OUT];
  const wram = outcome.files[`${RAW_OUT}.wram`];
  if (!fb || !wram) throw new Error(`ct.exe --fb wrote nothing (exit ${outcome.status})
${tailOf(outcome)}`);
  return { fb, wram, vram: new Uint8Array(0), oam: new Uint8Array(0), state };
};

export { powerOnCall };
