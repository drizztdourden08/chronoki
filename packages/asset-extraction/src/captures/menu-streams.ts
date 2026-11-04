/* @layer shared-asset-extraction @kind logic */
import { FF } from './closure-world.constants';

const menuStreams = (): Map<string, Set<number>> => new Map([['menu LZ streams', new Set([FF + 0xe8dc])]]);

export { menuStreams };
