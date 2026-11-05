/* @layer bridge-wasm @kind logic */
import { applyQolToPack, buildChestMarkers, hostGate, QOL_PACK_IDS } from '@chronoki/game-core';
import { appLog } from '@app/log/app-log';
import { chestMarkersHolder } from './chest-markers-holder';

const prepareQolAssets = (assets: Uint8Array): Uint8Array => {
  const enabled = new Set(QOL_PACK_IDS.filter((id) => hostGate(id)));
  const result = enabled.size === 0 ? { bytes: assets, skipped: [] } : applyQolToPack(assets, enabled);
  result.skipped.forEach((s) => appLog.warn(`[QoL] ${s.id} skipped: ${s.why.join(', ')}`));
  chestMarkersHolder.markers = buildChestMarkers(result.bytes);
  return result.bytes;
};

export { prepareQolAssets };
