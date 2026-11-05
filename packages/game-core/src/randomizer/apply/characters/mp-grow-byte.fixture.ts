/* @layer bridge-wasm @kind fixture */
import { MP_PAIRS } from './duplicate-kind.fixture.constants';

const mpGrowByte = (i: number): number => MP_PAIRS[i % 8] ?? 0;

export { mpGrowByte };
