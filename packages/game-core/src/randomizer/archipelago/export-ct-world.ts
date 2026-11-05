/* @layer bridge-wasm @kind logic */
import { exportApWorld } from '@drizztdourden08/brock-randomizer/archipelago';
import type { WorldExport } from '@drizztdourden08/brock-randomizer/archipelago';
import { CT_AP_EXPORT_SOURCE } from './ct-ap-export-source.constants';

const exportCtWorld = (): WorldExport => exportApWorld(CT_AP_EXPORT_SOURCE);

export { exportCtWorld };
