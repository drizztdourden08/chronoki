/* @layer shared-asset-extraction @kind logic */
import type { StageRun } from '../pipeline/stage.type';
import { genAnimengGato } from './animeng-gato';
import { genAtbsel } from './atbsel';
import { genBattleAnim } from './battle-anim';
import { genBattleAnimAdd } from './battle-anim-add';
import { genBattleDissolve } from './battle-dissolve';
import { genBattleFx } from './battle-fx';
import { genBattleGatoAtkfaces } from './battle-gato-atkfaces';
import { genBattleGatoFaces } from './battle-gato-faces';
import { genBattleHetake } from './battle-hetake';
import { genBattleHud } from './battle-hud';
import { genBattleHudSub } from './battle-hud-sub';
import { genBattleMarleAtk } from './battle-marleatk';
import { genBattleSettle } from './battle-settle';
import { genBattleStance } from './battle-stance';
import { genCtCharbase } from './ct-charbase';
import { genCtNgPan } from './ct-ng-pan';
import { genDlgCursor } from './dlg-cursor';
import { genMenuArrow } from './menu-arrow';
import { genMenuChrome } from './menu-chrome';
import { oracleGenStage } from './oracle-gen-stage';

/** The first half (alphabetical by module) of the oracle power-on generators, stage id -> runner. */
const ORACLE_RUNNERS_A: Record<string, StageRun> = {
  animeng_gato: oracleGenStage(genAnimengGato),
  atbsel: oracleGenStage(genAtbsel),
  battle_anim: oracleGenStage(genBattleAnim),
  battle_anim_add: oracleGenStage(genBattleAnimAdd),
  battle_dissolve: oracleGenStage(genBattleDissolve),
  battle_fx: oracleGenStage(genBattleFx),
  battle_gato_atkfaces: oracleGenStage(genBattleGatoAtkfaces),
  battle_gato_faces: oracleGenStage(genBattleGatoFaces),
  battle_hetake: oracleGenStage(genBattleHetake),
  battle_hud: oracleGenStage(genBattleHud),
  battle_hud_sub: oracleGenStage(genBattleHudSub),
  battle_marleatk: oracleGenStage(genBattleMarleAtk),
  battle_settle: oracleGenStage(genBattleSettle),
  battle_stance: oracleGenStage(genBattleStance),
  ct_charbase: oracleGenStage(genCtCharbase),
  ct_ng_pan: oracleGenStage(genCtNgPan),
  dlg_cursor: oracleGenStage(genDlgCursor),
  menu_arrow: oracleGenStage(genMenuArrow),
  menu_chrome: oracleGenStage(genMenuChrome),
};

export { ORACLE_RUNNERS_A };
