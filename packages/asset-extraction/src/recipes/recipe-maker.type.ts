/* @layer shared-asset-extraction @kind types */
import type { OracleDriver } from '../oracle/oracle-driver.type';
import type { WorkStore } from '../pipeline/work-store.type';
import type { RecipeSet } from './recipe.type';

interface MakerEnv {
  recipes: RecipeSet;
  oracle: OracleDriver;
  work: WorkStore;
  romSha1: string;
  jobs: number;
  log: (message: string) => void;
}

export type { MakerEnv };
