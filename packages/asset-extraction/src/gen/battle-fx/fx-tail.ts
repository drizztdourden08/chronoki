/* @layer shared-asset-extraction @kind logic */
import { FLASH_PAL, FLASH_FRAME, RISE_DY } from './fx-head.constants';
import { w4 } from './hex-word';
import { word } from './cg-word';

const tailText = (fpal: Uint8Array): string => {
  const out: string[] = [];
  const W = (s: string): void => {
    out.push(s);
  };
  W(`// OBJ palette ${FLASH_PAL} = the HURT/HIT FLASH: entries 1..15 all white (0x7FFF). Render the TARGET's\n`);
  W("// own pose tiles (from battle_stance.h) in this palette for a solid-white silhouette flash.\n");
  W(`// (Read from the GATO hit-flash frame f${FLASH_FRAME}; pal4 is a normal OBJ palette outside a flash.)\n`);
  W('static const uint16_t ctBattleFxFlashPal[16] = {');
  W(Array.from({ length: 16 }, (_, c) => `0x${w4(word(fpal, 128 + FLASH_PAL * 16 + c))}`).join(','));
  W('};\n\n');
  W("// The damage number's vertical offset from its rest row, per render frame (index 0 = birth).\n");
  W('// MEASURED byte-exact (dossier P1) and target-independent. Parabolic hop: born +7 below rest,\n');
  W('// up to -16 (peak, idx 8), linear +1/frame back to 0 (idx 24=rest). Then hold dy=0 (CT_FX_HOLD).\n');
  W(`static const int8_t ctBattleFxRiseDY[CT_FX_RISE_N] = {${RISE_DY.join(',')}};\n\n`);
  W('// Number origin (dossier P1, MEASURED). leftX = left-digit x; restY = rest row (dy applied on\n');
  W('// top). Horizontal: centered on the ENEMY target\'s sprite center (GATO exact); PC target uses a\n');
  W('// stored per-combatant anchor (formula = boundary). Observed constants (GATO fight):\n');
  W('//   GATO  target: leftX 128, restY 96   (2-digit; centerX 136 ~= GATO sprite centerX 135)\n');
  W('//   Crono target: leftX 126, restY 129\n');
  W('#endif // CT_BATTLE_FX_H\n');
  return out.join('');
};

export { tailText };
