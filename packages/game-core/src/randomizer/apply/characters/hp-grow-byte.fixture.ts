/* @layer bridge-wasm @kind fixture */
import { HP_PAIRS } from './duplicate-kind.fixture.constants';

const hpGrowByte = (i: number): number => HP_PAIRS[i % 8] ?? 0;

export { hpGrowByte };
