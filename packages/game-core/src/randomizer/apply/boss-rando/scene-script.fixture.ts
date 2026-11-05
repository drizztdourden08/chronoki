/* @layer bridge-wasm @kind fixture */
import { le16 } from './le16.fixture';

const sceneScript = (enemy: number, slot: number): number[] => [1, ...le16(32), ...new Array<number>(30).fill(0), 0x83, enemy, slot, 0x00];

export { sceneScript };
