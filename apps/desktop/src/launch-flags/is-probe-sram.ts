/* @layer renderer-lib @kind logic */
import { startupFlag } from './startup-flag';

const isProbeSram = (): boolean => startupFlag('probe-sram') === true;

export { isProbeSram };
