/* @layer root-config @kind config */
import { defineBrockConfig } from '@drizztdourden08/brock-build/config';
import type { WorkflowStep } from '@drizztdourden08/brock-build/config';

const wasmCoreSteps: WorkflowStep[] = [
  { name: 'Set up Emscripten', uses: 'emscripten-core/setup-emsdk@v16', with: { version: '5.0.7' } },
  { name: 'Build the wasm core', shell: 'bash', run: 'pnpm --filter chronoki-desktop run ensure-wasm' },
];

export default defineBrockConfig({
  product: {
    id: 'chronoki',
    name: 'ChronoKi',
    appId: 'com.drizztdourden08.chronoki',
    ports: { base: 2010 },
    description: 'A desktop and mobile port of Chrono Trigger. You bring your own ROM.',
    author: { name: 'drizztdourden_', email: 'drizztdourden08@users.noreply.github.com' },
    copyright: 'Copyright (c) 2026 drizztdourden_',
    linuxCategory: 'Game',
    window: { titleBar: { mobile: false } },
    artifactPrefix: 'chronoki-',
    dataDirs: ['assets', 'roms', 'msu', 'profiles', 'config', 'input', 'sprites'],
    schemes: [{ scheme: 'app-sprite', dir: 'sprites' }],
    icons: { brand: 'chronoki', wordmark: { src: './logos/wordmark.svg', rendering: 'pixelated' } },
    profilesRoute: 'data/profiles',
  },
  packaging: {
    extraResources: [
      { from: 'node_modules/@drizztdourden08/tessera/fonts/chronotype/LICENSE.txt', to: 'fonts/chronotype/license.txt' },
      { from: 'node_modules/@drizztdourden08/tessera/fonts/chronotype/README.txt', to: 'fonts/chronotype/readme.txt' },
    ],
  },
  targets: ['desktop', 'android', 'web'],
  modules: ['display', 'port-kit', 'input', 'game-info', 'randomizer'],
  workflows: {
    steps: {
      ci: { beforeBuild: wasmCoreSteps },
      release: { beforePackage: wasmCoreSteps },
    },
  },
});
