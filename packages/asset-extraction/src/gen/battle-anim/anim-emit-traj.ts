/* @layer shared-asset-extraction @kind logic */
import { dec } from '../shared/py-format';
import { CRONO_REF, GATO_REF } from './anim-consts';
import type { BobStep, CronoStep, GatoStep } from './anim-tables';

/** The three per-frame trajectory tables of battle_anim.h (Crono attack, GATO idle, Crono idle bob). */
const emitTraj = (cronoTab: CronoStep[], bobTab: BobStep[], gidleTab: GatoStep[]): string => {
  const o: string[] = [];
  const W = (s: string): void => {
    o.push(s);
  };
  W(`// ---- Crono ATTACK per-frame trajectory (MASH timeline f440..530). dx,dy = anchor - (${CRONO_REF[0]},${CRONO_REF[1]}).\n`);
  W('// poseId: -1=idle(battle_stance.h P0) 0=A1_approach 1=A2_gather 2=A3_raise 3=A4_strike\n');
  W("//         4=A5_recoil 5=A6_settle  (indexes ctBattleAnimKf's Crono entries).\n");
  W('typedef struct { int16_t dx; int8_t dy; int8_t poseId; } CtAnimStep;\n');
  W('#define CT_CRONO_ATK_F0 440\n');
  W(`#define CT_CRONO_ATK_N ${cronoTab.length}\n`);
  W('static const CtAnimStep ctCronoAttackTraj[CT_CRONO_ATK_N] = {\n');
  for (const [F, dx, dy, pid] of cronoTab) W(`  { ${dec(dx ?? 0, 4)}, ${dec(dy ?? 0, 4)}, ${dec(pid, 2)} }, // f${F}\n`);
  W('};\n\n');

  W(`// ---- GATO IDLE per-frame (HOLD timeline f384..504). dx,dy = anchor - (${GATO_REF[0]},${GATO_REF[1]}).\n`);
  W('// arm: 0=I0_armsRest 1=I1_armsSwap (the claw up/down swap). footDY = 0 (DEPRECATED: the old\n');
  W("// tile-0x06 'foot-bob' was the active-PC BRACKET, not GATO -- now its own asset battle_bracket.h).\n");
  W("// GATO's real idle = the claw swap + body-tile stream. One observed cycle (GATO acts at f505).\n");
  W('typedef struct { int16_t dx; int8_t dy; uint8_t arm; uint8_t footDY; } CtGatoIdleStep;\n');
  W('#define CT_GATO_IDLE_F0 384\n');
  W(`#define CT_GATO_IDLE_N ${gidleTab.length}\n`);
  W('static const CtGatoIdleStep ctGatoIdleTraj[CT_GATO_IDLE_N] = {\n');
  for (const [F, dx, dy, arm, footdy] of gidleTab) {
    W(`  { ${dec(dx, 4)}, ${dec(dy, 3)}, ${arm}, ${dec(footdy, 3)} }, // f${F}\n`);
  }
  W('};\n\n');

  W(`// ---- Crono ACTIVE-PC idle bob (HOLD f400..504). dx,dy = anchor - (${CRONO_REF[0]},${CRONO_REF[1]}). state 0=rest 1=down 2=side.\n`);
  W('// A subtle +-1..2px 3-state micro-oscillation (irregular cadence -- observed sequence, anim-slot\n');
  W('// phase-driven; only ~2 sub-tiles stream). The WAITING PC (Marle) is static (no bob).\n');
  W('typedef struct { int16_t dx; int8_t dy; uint8_t state; } CtCronoBobStep;\n');
  W('#define CT_CRONO_BOB_F0 400\n');
  W(`#define CT_CRONO_BOB_N ${bobTab.length}\n`);
  W('static const CtCronoBobStep ctCronoIdleBob[CT_CRONO_BOB_N] = {\n');
  for (const [F, dx, dy, st] of bobTab) W(`  { ${dec(dx, 4)}, ${dec(dy, 3)}, ${st} }, // f${F}\n`);
  W('};\n\n');
  W('#endif // CT_BATTLE_ANIM_H\n');
  return o.join('');
};

export { emitTraj };
