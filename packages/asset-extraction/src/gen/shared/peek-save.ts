/* @layer shared-asset-extraction @kind logic */
import type { PeekDump, PeekOracle, PeekRequest } from '../../oracle/peek.type';

/**
 * ct.exe --peek with PEEK_SAVE: the run also saves its final state. The oracle driver returns it as `state` on
 * the dump (an extension of PeekDump that only drivers supporting PEEK_SAVE fill in).
 */
const peekSaved = async (oracle: PeekOracle, req: PeekRequest): Promise<Uint8Array> => {
  const dump = (await oracle.peek({ ...req, env: { ...req.env, PEEK_SAVE: 'state' } })) as PeekDump & {
    state?: Uint8Array;
  };
  if (!dump.state) throw new Error('this stage needs the oracle driver to return the PEEK_SAVE state of a peek');
  return dump.state;
};

export { peekSaved };
