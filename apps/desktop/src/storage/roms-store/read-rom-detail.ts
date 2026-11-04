/* @layer renderer-lib @kind logic */
import { romStoreOf } from '../rom-files';
import { platformFiles } from '../platform-files';
import type { RomDetailInfo } from './roms-store.type';

const readRomDetail = async (romFile: string): Promise<RomDetailInfo | null> => {
  const check = await romStoreOf(platformFiles()).read(romFile);
  if (!check) return null;
  if (!check.ok) return { verdict: 'refused', hash: check.hash, identity: null, size: null, refusal: check.reason };
  const { hash, identity, bytes, unknown } = check.rom;
  return { verdict: unknown ? 'unknown' : 'known', hash, identity: identity.label, size: bytes.length, refusal: null };
};

export { readRomDetail };
