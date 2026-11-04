/* @layer shared-asset-extraction @kind constants */
import { stage } from '../stage-def';
import type { StageDef } from '../stage.type';

/**
 * The remaining generators, in setup.py's order (manifest.json, manifest_battle.json, manifest_menu.json): progress
 * 11 to 59. Weight 1 reads only the ROM; weight 6 replays an oracle state. The ported ones are in gen/gen-runners.ts.
 */
const GENERATE_STAGES: StageDef[] = [
  stage('battle_trig', 'generate', 1, 'ported', 'gen/battle_trig.py', 'battle_trig.h'),
  stage('menu_desc', 'generate', 1, 'ported', 'gen/menu_desc.py', 'menu_desc.h'),
  stage('menu_romdata', 'generate', 1, 'ported', 'gen/menu_romdata.py', 'menu_romdata.h'),
  stage('menu_wingrad', 'generate', 1, 'ported', 'gen/menu_wingrad.py', 'menu_wingrad.h'),
  stage('menu_equip', 'generate', 1, 'ported', 'gen/menu_equip.py', 'menu_equip.h'),
  stage('coll_slope', 'generate', 1, 'ported', 'gen/coll_slope.py', 'coll_slope.h'),
  stage('menu_techrom', 'generate', 1, 'ported', 'gen/menu_techrom.py', 'menu_techrom.h'),
  stage('ow_anim', 'generate', 1, 'ported', 'gen/ow_anim.py', 'ow_anim.h'),
  stage('ct_regroup', 'generate', 1, 'ported', 'gen/ct_regroup.py', 'ct_regroup.h'),
  stage('animeng_pc', 'generate', 1, 'ported', 'gen/animeng_pc.py', 'animeng_e3_pc.h, animeng_sheet_pc.h, animeng_e4_pc.h'),
  stage('title_intro', 'generate', 6, 'pending', 'gen/title_intro.py', 'title_intro.h', ['oracle']),
  stage('seq_credits', 'generate', 6, 'pending', 'gen/seq_credits.py', 'seq_credits.h', ['oracle']),
  stage('seq_c3', 'generate', 6, 'pending', 'gen/xlat_all.py seq_c3', 'seq_c3.c', ['oracle']),
  stage('wipe_c3', 'generate', 6, 'pending', 'gen/xlat_all.py wipe_c3', 'wipe_c3.c', ['oracle']),
  stage('owwin_c6', 'generate', 6, 'pending', 'gen/xlat_all.py owwin_c6', 'owwin_c6.c', ['oracle']),
  stage('gwarp_fd', 'generate', 6, 'pending', 'gen/xlat_all.py gwarp_fd', 'gwarp_fd.c', ['oracle']),
  stage('hdma_fd', 'generate', 6, 'pending', 'gen/xlat_all.py hdma_fd', 'hdma_fd.c', ['oracle']),
  stage('battle_hud', 'generate', 6, 'pending', 'gen/battle_hud.py', 'battle_hud.h', ['oracle']),
  stage('battle_hud_sub', 'generate', 6, 'pending', 'gen/battle_hud_sub.py', 'battle_hud_sub.h', ['oracle']),
  stage('battle_hud_chrome', 'generate', 1, 'ported', 'gen/battle_hud_chrome.py', 'battle_hud_chrome.h'),
  stage('ct_charbase', 'generate', 6, 'pending', 'gen/ct_charbase.py', 'ct_charbase.h', ['oracle']),
  stage('atbsel', 'generate', 6, 'pending', 'gen/atbsel.py', 'atbsel.h', ['oracle']),
  stage('battle_dissolve', 'generate', 6, 'pending', 'gen/battle_dissolve.py', 'battle_dissolve.h', ['oracle']),
  stage('animeng_gato', 'generate', 6, 'pending', 'gen/animeng_gato.py', 'animeng_e3_gato.h, animeng_e4_gato.h, animeng_sheet_gato.h', ['oracle']),
  stage('battle_anim_add', 'generate', 6, 'pending', 'gen/battle_anim_add.py', 'battle_anim_add.h', ['oracle']),
  stage('battle_fx', 'generate', 6, 'pending', 'gen/battle_fx.py', 'battle_fx.h', ['oracle']),
  stage('battle_marleatk', 'generate', 6, 'pending', 'gen/battle_marleatk.py', 'battle_marleatk.h', ['oracle']),
  stage('battle_settle', 'generate', 6, 'pending', 'gen/battle_settle.py', 'battle_settle.h', ['oracle']),
  stage('battle_gato_faces', 'generate', 6, 'pending', 'gen/battle_gato_faces.py', 'battle_gato_faces.h', ['oracle']),
  stage('battle_stance', 'generate', 6, 'pending', 'gen/battle_stance.py', 'battle_stance.h', ['oracle']),
  stage('battle_anim', 'generate', 6, 'pending', 'gen/battle_anim.py', 'battle_anim.h', ['oracle']),
  stage('battle_gato_atkfaces', 'generate', 6, 'pending', 'gen/battle_gato_atkfaces.py', 'battle_gato_atkfaces.h', ['oracle']),
  stage('battle_hetake', 'generate', 6, 'pending', 'gen/battle_hetake.py', 'battle_hetake.h', ['oracle']),
  stage('ct_ng_pan', 'generate', 6, 'pending', 'gen/ct_ng_pan.py', 'ct_ng_pan.h', ['oracle']),
  stage('ow_gullmap', 'generate', 6, 'pending', 'gen/ow_gullmap.py', 'ow_gullmap.h', ['oracle']),
  stage('ow_era_placard', 'generate', 6, 'pending', 'gen/ow_era_placard.py', 'ow_era_placard.h', ['oracle']),
  stage('dlg_cursor', 'generate', 6, 'pending', 'gen/dlg_cursor.py', 'dlg_cursor.h', ['oracle']),
  stage('menu_loader', 'generate', 6, 'pending', 'gen/menu_loader.py', 'menu_loader.h', ['oracle']),
  stage('menu_chrome', 'generate', 6, 'pending', 'gen/menu_chrome.py', 'menu_chrome.h', ['oracle']),
  stage('menu_saveform', 'generate', 6, 'pending', 'gen/menu_saveform.py', 'menu_saveform.h', ['oracle']),
  stage('menu_shop', 'generate', 6, 'pending', 'gen/menu_shop.py', 'menu_shop.h', ['oracle']),
  stage('menu_configgrid', 'generate', 6, 'pending', 'gen/menu_configgrid.py', 'menu_configgrid.h', ['oracle']),
  stage('menu_icons', 'generate', 6, 'pending', 'gen/menu_icons.py', 'menu_icons.h', ['oracle']),
  stage('menu_itemdetail', 'generate', 6, 'pending', 'gen/menu_itemdetail.py', 'menu_itemdetail.h', ['oracle']),
  stage('menu_tech', 'generate', 6, 'pending', 'gen/menu_tech.py', 'menu_tech.h', ['oracle']),
  stage('menu_arrow', 'generate', 6, 'pending', 'gen/menu_arrow.py', 'menu_arrow.h', ['oracle']),
  stage('menu_opt0', 'generate', 6, 'pending', 'gen/menu_opt0.py', 'menu_opt0.h', ['oracle']),
  stage('menu_itemoverlay', 'generate', 6, 'pending', 'gen/menu_itemoverlay.py', 'menu_itemoverlay.h', ['oracle']),
  stage('menu_itemuse', 'generate', 6, 'pending', 'gen/menu_itemuse.py', 'menu_itemuse.h', ['oracle']),
];

export { GENERATE_STAGES };
