/* @layer bridge-wasm @kind logic */
import { serveAssetSteps } from '@drizztdourden08/brock-port-kit/web-worker';
import { assetsStep, steamStep } from './extract-steps';

serveAssetSteps({ assets: assetsStep, steam: steamStep });
