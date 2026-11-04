/* @layer shared-asset-extraction @kind logic */
import type { PeekDump, PeekOracle, PeekRequest } from '../../oracle/peek.type';

const peekSaved = async (oracle: PeekOracle, req: PeekRequest): Promise<Uint8Array> => {
  const dump = (await oracle.peek({ ...req, env: { ...req.env, PEEK_SAVE: 'state' } })) as PeekDump & {
    state?: Uint8Array;
  };
  if (!dump.state) throw new Error('this stage needs the oracle driver to return the PEEK_SAVE state of a peek');
  return dump.state;
};

export { peekSaved };
