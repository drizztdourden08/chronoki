/* @layer bridge-wasm @kind logic */
import { serveAssetSteps } from '@drizztdourden08/brock-port-kit/web-worker';
import { assetsStep } from './extract-steps';

serveAssetSteps({ assets: assetsStep });
