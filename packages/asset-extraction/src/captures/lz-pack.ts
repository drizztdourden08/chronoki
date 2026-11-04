/* @layer shared-asset-extraction @kind logic */
import { locationStreams } from './closure-locations';
import { sequenceStreams } from './sequence-streams';
import { spriteStreams, stageStreams } from './closure-world';
import { worldStreams } from './world-streams';
import { menuStreams } from './menu-streams';
import { lzPackStage } from './lz-pack-stage';

const sources = (rom: Uint8Array): Map<string, Set<number>>[] => [
  locationStreams(rom),
  sequenceStreams(rom),
  spriteStreams(rom),
  menuStreams(),
  worldStreams(rom),
  stageStreams(rom),
];

const lzList = (rom: Uint8Array): string => {
  const per: string[] = [];
  const offs = new Set<number>();
  for (const source of sources(rom)) {
    for (const [what, got] of source) {
      per.push(`${what} ${got.size}`);
      for (const o of got) offs.add(o);
    }
  }
  const lines = [...offs].sort((a, b) => a - b).map((o) => `${o.toString(16).toUpperCase().padStart(6, '0')}\n`);
  return `# tools/gen/lz_pack.py: ${per.join(', ')}\n${lines.join('')}`;
};

export { lzList };
