/* @layer shared-asset-extraction @kind constants */
import type { StageRun } from '../pipeline/stage.type';
import { ctxTextStage } from './ctgen/ctx-text-stage';
import { genMenuConfiggrid } from './menu-configgrid';
import { genMenuIcons } from './menu-icons';
import { genMenuItemdetail } from './menu-itemdetail';
import { genMenuItemoverlay } from './menu-itemoverlay';
import { genMenuItemuse } from './menu-itemuse';
import { genMenuLoader } from './menu-loader';
import { genMenuOpt0 } from './menu-opt0';
import { genMenuSaveform } from './menu-saveform';
import { genMenuShop } from './menu-shop';
import { genMenuTech } from './menu-tech';
import { genOwEraPlacard } from './ow-era-placard';
import { genOwGullmap } from './ow-gullmap';
import { genSeqCredits } from './seq-credits';
import { genTitleIntro } from './title-intro';

const ORACLE_GEN_RUNNERS_B: Record<string, StageRun> = {
  menu_configgrid: ctxTextStage('menu_configgrid', genMenuConfiggrid),
  menu_icons: ctxTextStage('menu_icons', genMenuIcons),
  menu_itemdetail: ctxTextStage('menu_itemdetail', genMenuItemdetail),
  menu_itemoverlay: ctxTextStage('menu_itemoverlay', genMenuItemoverlay),
  menu_itemuse: ctxTextStage('menu_itemuse', genMenuItemuse),
  menu_loader: ctxTextStage('menu_loader', genMenuLoader),
  menu_opt0: ctxTextStage('menu_opt0', genMenuOpt0),
  menu_saveform: ctxTextStage('menu_saveform', genMenuSaveform),
  menu_shop: ctxTextStage('menu_shop', genMenuShop),
  menu_tech: ctxTextStage('menu_tech', genMenuTech),
  ow_era_placard: ctxTextStage('ow_era_placard', genOwEraPlacard),
  ow_gullmap: ctxTextStage('ow_gullmap', genOwGullmap),
  seq_credits: ctxTextStage('seq_credits', genSeqCredits),
  title_intro: ctxTextStage('title_intro', genTitleIntro),
};

export { ORACLE_GEN_RUNNERS_B };
