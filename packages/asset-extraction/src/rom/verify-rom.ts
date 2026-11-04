/* @layer shared-asset-extraction @kind logic */
import { CT_ROM_NAME, CT_ROM_SHA1, CT_ROM_SIZE } from './rom.constants';
import { RomError } from './rom-error';
import { sha1Hex } from './sha1';

/** ctlib/rom.py verify(): the data (header already dropped) must be the supported dump, or a clear error. */
const verifyRom = (data: Uint8Array): Uint8Array => {
  const sha1 = sha1Hex(data).toUpperCase();
  if (data.length === CT_ROM_SIZE && sha1 === CT_ROM_SHA1) return data;
  const code = data.length === CT_ROM_SIZE ? 'unknown-rom' : 'wrong-size';
  throw new RomError(
    code,
    `This is not the supported ROM: ${CT_ROM_NAME}, SHA-1 ${CT_ROM_SHA1}, ${CT_ROM_SIZE} bytes ` +
      `(got ${data.length} bytes, SHA-1 ${sha1}). Dump your own cartridge.`,
    sha1,
    data.length,
  );
};

export { verifyRom };
