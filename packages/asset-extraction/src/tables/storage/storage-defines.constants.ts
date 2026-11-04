/* @layer shared-asset-extraction @kind constants */
/**
 * The #defines a data-free build must keep as compile-time constants because the engine needs them as one, each with
 * the reason (pack_tables.py COMPILED_IN; a table's own dimensions are found from the headers, not listed here).
 */
const COMPILED_IN: Record<string, string> = {
  CT_BHUD_H: "src/field.c: the bound of battleHudRenderStrip's mathOp[]/mathFix[] and of CtBattleHudRender's static keep[]",
  CT_MENU_WINLIST_N: "src/menu.c: the bound of mWinGrad's static cache[] and built[]",
};

const DIM_REASON = 'a dimension of a table (the storage a data-free build compiles)';

export { COMPILED_IN, DIM_REASON };
