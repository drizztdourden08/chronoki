/* @layer bridge-wasm @kind logic */
import { CKST_SECTION_VERSION, STAMP_LEGACY_TEXT, TAG_APU, TAG_SCENE, TAG_STAMP } from './ck-state.constants';
import { decodeCkState } from './decode-ck-state';
import { encodeSectionedState } from './encode-sectioned-state';

const upgradeLegacyState = (bytes: Uint8Array): Uint8Array | null => {
  const parts = decodeCkState(bytes);
  if (!parts) return null;
  return encodeSectionedState([
    { tag: TAG_STAMP, version: CKST_SECTION_VERSION, bytes: new TextEncoder().encode(STAMP_LEGACY_TEXT) },
    { tag: TAG_SCENE, version: CKST_SECTION_VERSION, bytes: parts.scene },
    { tag: TAG_APU, version: CKST_SECTION_VERSION, bytes: parts.apu },
  ]);
};

export { upgradeLegacyState };
