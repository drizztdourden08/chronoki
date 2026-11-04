// The menu section's guard for menu.c's statics (docs/plans/save-state-anywhere-plan.md, phase 3). The mutable statics the
// section keeps are listed in reconnect/ck_menu_statics.h (ck_menu_state.inc, appended to the patched menu.c, takes their
// addresses); every other non-const file-scope static must be named below with its class, so a static upstream adds, renames
// or removes fails the build with its name. Only column-0 declarations are file scope (the parser is world-statics.mjs's).
//  * pointer: set and cleared around one render call (mChromeRowsGrad, mSprWpn, mChromeZero) or re-set by field.c every menu frame (g_formPanelDim) or re-derived after a load (g_charSelMem,
//    through menu.charSelSet and ckMenuAfterLoad);
//  * cache: colours and tiles loaded from the ROM on demand and keyed by the window colour, rebuilt when the key differs;
//  * scratch: pictures and bands one render call fills and reads (the frame after starts from a clear), so a state in
//    between holds nothing of them;
//  * const: a forward declaration of a const table.
import { macroList } from './world-fields.mjs';
import { fileScopeStatics } from './world-statics.mjs';

const EXCLUDED = {
  pointer: 'g_charSelMem g_formPanelDim mChromeZero mChromeRowsGrad mSprWpn',
  cache: 'mWinLoaded mWinColour mWinDim mWinTile mWinRow mWinDimRow mSlotColour mSlotTile mSlotRow mSlotSetOk',
  scratch: 'mRibbonW2On mRibbonW2 mHalfBand mListStrip mSlideTxt svSnap ldrSnap',
  const: 'gen_opt0_icon_def',
};

const checkMenuStatics = (text, root) => {
  const out = [];
  const kept = macroList(root, 'ck_menu_statics.h', 'CK_MSTAT').map(([n]) => n);
  const excluded = new Set(Object.values(EXCLUDED).flatMap((n) => n.split(' ')));
  const found = new Set(fileScopeStatics(text));
  for (const n of found) if (!kept.includes(n) && !excluded.has(n)) out.push(`menu.c static ${n} is new: add it to ck_menu_statics.h or classify it`);
  for (const n of kept) if (!found.has(n)) out.push(`ck_menu_statics.h lists ${n}, no longer a file-scope static of menu.c`);
  for (const n of excluded) if (!found.has(n)) out.push(`excluded menu.c static ${n} is no longer declared`);
  for (const n of kept) if (excluded.has(n)) out.push(`${n} is both kept and excluded`);
  if (out.length) throw new Error(`menu section statics out of step with menu.c:\n  ${out.join('\n  ')}`);
};

export { checkMenuStatics }
