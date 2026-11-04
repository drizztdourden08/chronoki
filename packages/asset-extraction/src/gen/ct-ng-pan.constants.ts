/* @layer shared-asset-extraction @kind constants */
import { hexN } from './shared/py-format';

const REGS = '7E0100:2,7E0020:2,7E0026:2,7E00E3:1,7E00E7:1';
const HEADER = ({ x, y, e3, e7, n }: { x: number; y: number; e3: number; e7: number; n: number }): string => `\
// The new-game 1000 A.D. overworld intro (loc 496): the STARTING camera of start_scene.state -- the same capture
// instant as the intro object snapshot the world blob carries (introSnap) -- and the pan's length.
//   $20 = ${hexN(x, 4)}, $26 = ${hexN(y, 4)} (BG1/BG2 scroll), cells $E3 = ${hexN(e3, 2)}, $E7 = ${hexN(e7, 2)}       (--monitor at f0)
//   the cutscene's own script requests loc $10F at frame ${n}              (C2:1150 \`$0100 = 010F\`, C2:1163 \`$027C = 02\`)
// The per-frame trajectory that used to be recorded here is gone: the cutscene's object scripts (C2/066C, C2/0568 --
// world.c obScroll) move the camera, and the port's $20/$26 equal the cartridge's on every frame of the pan.
#ifndef CT_NG_PAN_H
#define CT_NG_PAN_H
#define NG_PAN_FRAMES ${n}
#define NG_PAN_START_X ${x}
#define NG_PAN_START_Y ${y}
#endif
`;
const LINE =
  /^\s*f(\d+)\s+7E0100=([0-9A-F]{4})\*?\s+7E0020=([0-9A-F]{4})\*?\s+7E0026=([0-9A-F]{4})\*?\s+7E00E3=([0-9A-F]{2})\*?\s+7E00E7=([0-9A-F]{2})/;

export { REGS, HEADER, LINE };
