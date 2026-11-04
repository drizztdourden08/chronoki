/* @layer shared-asset-extraction @kind constants */
const COMPILED_IN: Record<string, string> = {
  CT_BHUD_H: "src/field.c: the bound of battleHudRenderStrip's mathOp[]/mathFix[] and of CtBattleHudRender's static keep[]",
  CT_MENU_WINLIST_N: "src/menu.c: the bound of mWinGrad's static cache[] and built[]",
};

const DIM_REASON = 'a dimension of a table (the storage a data-free build compiles)';

export { COMPILED_IN, DIM_REASON };
