/* @layer root-config @kind config */
import { brockEslint } from '@drizztdourden08/brock-lint-config';

export default brockEslint({
  presets: ['react-app'],
  ignores: ['**/.brock/**', 'core/wasm-build/**/*.mjs'],
});
