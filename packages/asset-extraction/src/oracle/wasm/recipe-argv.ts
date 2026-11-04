/* @layer shared-asset-extraction @kind logic */
import type { RecipeStep } from '../../recipes/recipe.type';
import { RAW_OUT, STATE_IN, STATE_OUT } from './wasm-paths.constants';
import type { StepCall } from './recipe-argv.type';
import { SAVE } from './recipe-argv.constants';

const stepCall = (step: RecipeStep): StepCall => {
  switch (step.op) {
    case 'power_on':
      return { args: ['--fb', RAW_OUT, '--frames', String(step.frames)], env: SAVE, needsState: false };
    case 'boot_to_bedroom':
      return { args: ['--fb', RAW_OUT, '--script', '--frames', '1'], env: SAVE, needsState: false };
    case 'pad':
      return { args: ['--peek', STATE_IN, RAW_OUT, '--btnscript', step.script], env: SAVE, needsState: true };
    case 'poke':
      return {
        args: ['--peek', STATE_IN, RAW_OUT, '--btnscript', '0:0'],
        env: { ...SAVE, PEEK_POKE: step.pokes },
        needsState: true,
      };
    case 'teleport':
      return {
        args: [
          '--teleport', String(step.scene), String(step.tx), String(step.ty), String(step.facing),
          '--from', STATE_IN, '--method', step.method, '--frames', String(step.frames), '--out', STATE_OUT,
        ],
        env: {},
        needsState: true,
      };
    default:
      throw new Error(`recipe step ${step.op} is not executable (the replay code resolves it)`);
  }
};

export { stepCall };
