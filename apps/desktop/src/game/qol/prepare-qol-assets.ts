/* @layer bridge-wasm @kind logic */
import { applyQolToPack, hostGate, QOL_PACK_IDS } from '@chronoki/game-core';
import { appLog } from '@app/log/app-log';

const prepareQolAssets = (assets: Uint8Array): Uint8Array => {
  const enabled = new Set(QOL_PACK_IDS.filter((id) => hostGate(id)));
  if (enabled.size === 0) return assets;
  const result = applyQolToPack(assets, enabled);
  result.skipped.forEach((s) => appLog(`[QoL] ${s.id} skipped: ${s.why.join(', ')}`));
  return result.bytes;
};

export { prepareQolAssets };
