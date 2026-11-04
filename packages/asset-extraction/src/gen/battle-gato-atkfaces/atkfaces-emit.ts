/* @layer shared-asset-extraction @kind logic */
import { hex } from '../c-text';
import { sheetRows } from '../shared/sheet-rows';
import { NTILE } from '../shared/gato-bake.constants';
import { dec } from '../shared/py-format';
import type { Pose, Face } from './atkfaces-emit.type';
import { HEAD } from './atkfaces-emit.constants';

const atkFacesText = (poses: Pose[], faces: Face[]): string => {
  const out: string[] = [HEAD, 'static const CtGatoAtkCell ctGatoAtkCell[] = {\n'];
  const offs: [number, number][] = [];
  let off = 0;
  for (const p of poses) {
    out.push(`  // ${p.label} (md5 ${p.md5})\n`);
    for (const c of p.rel) out.push(`  { ${dec(c.rx, 4)}, ${dec(c.ry, 4)}, 0x${hex(c.tile, 3)} },\n`);
    offs.push([off, p.rel.length]);
    off += p.rel.length;
  }
  out.push('};\n\n');
  out.push(`#define CT_GATO_ATK_NFACE ${faces.length}\n`);
  out.push(`static const CtGatoAtkFace ctGatoAtkFace[CT_GATO_ATK_NFACE] = {\n`);
  for (const f of faces) {
    const [ro, rn] = offs[f.rear] as [number, number];
    const [so, sn] = offs[f.strike] as [number, number];
    out.push(`  { "${f.name}", ${f.facing}, ${f.strikeAt}, ${ro}, ${rn}, ${f.rear}, ${so}, ${sn}, ${f.strike} },\n`);
  }
  out.push('};\n\n');
  out.push(`#define CT_GATO_ATK_NTILE 0x${NTILE.toString(16).toUpperCase()}\n`);
  poses.forEach((p, k) => {
    out.push(`// ${p.label} tile sheet (capture VRAM OBJ half, body md5 ${p.md5})\n`);
    out.push(`static const uint8_t ctGatoAtkTiles${k}[CT_GATO_ATK_NTILE][32] = {\n`);
    out.push(sheetRows(p.tiles), '};\n');
  });
  const names = poses.map((_, k) => `ctGatoAtkTiles${k}`).join(', ');
  out.push(`static const uint8_t (*const ctGatoAtkTilesTab[${poses.length}])[32] = { ${names} };\n`, '#endif\n');
  return out.join('');
};

export { atkFacesText };
