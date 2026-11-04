# P4 stage map: setup.py to TypeScript

Registry: `packages/asset-extraction/src/pipeline/stages.ts` (definitions in `pipeline/stage-defs/`). 65 stages, 61 of them
counted in setup.py's "progress K/N". Ported 10, pending 55. Python paths are relative to Belthasar's `tools/`.

## Pipeline, ROM, container, pack

| Python | TS file | Status |
|---|---|---|
| ctlib/rom.py load, verify, header strip | `rom/load-rom.ts`, `normalize-rom.ts`, `verify-rom.ts`, `sha1.ts` | ported |
| setup.py main (stage loop, progress, jobs) | `pipeline/run-pipeline.ts`, `plan-groups.ts`, `limit.ts` | ported |
| recipes.py (load_all, chain, key, make, make_many, check_expect, pad scripts) | `recipes/*.ts` | ported (cache key text is ChronoKi's own) |
| ct.exe oracle | `oracle/oracle-driver.type.ts` | interface only (P3 supplies the WASM driver) |
| extract_assets.py container (build layout) | `ctas/ctas-builder.ts`, `read-ctas.ts` | ported |
| pack_tables.py back end (layout, relocs, pool, FNV hash, container, merge_into) | `tables/*.ts`, `ctas/table-container.ts` | ported; pointer width is a parameter |
| pack_tables.py front end (Headers, Expr, lexer: C parser) | none | pending |

## Stages

| Stage | Python | Group | Status |
|---|---|---|---|
| verify-rom | setup.py main; ctlib/rom.py | setup | ported (`pipeline/setup-runners.ts`) |
| shapes-install | gen/shapes.py install | setup | pending |
| oracle | setup.py main (ct.exe) | setup | ported (needs the oracle driver) |
| replay-recipes | recipes.py make_many | setup | ported (needs the oracle driver) |
| snd_timing, anim_oplen, lz_pack, ow_world, ow_sprites, ct_window, ct_namewin, ct_namemsg | gen/<name>.py | captures | pending (oracle) |
| extract-assets | ../assets/extract_assets.py build | extract | pending (24 compile-* packers) |
| battle_trig | gen/battle_trig.py | generate | ported (`gen/battle-trig.ts`) |
| menu_romdata | gen/menu_romdata.py | generate | ported (`gen/menu-romdata.ts`) |
| menu_wingrad | gen/menu_wingrad.py | generate | ported (`gen/menu-wingrad.ts`) |
| coll_slope | gen/coll_slope.py | generate | ported (`gen/coll-slope.ts`) |
| ow_anim | gen/ow_anim.py | generate | ported (`gen/ow-anim.ts`) |
| ct_regroup | gen/ct_regroup.py | generate | ported (`gen/ct-regroup.ts`) |
| menu_desc | gen/menu_desc.py | generate | pending (text.py, compile) |
| menu_equip, menu_techrom, animeng_pc, battle_hud_chrome | gen/<name>.py | generate | pending (ROM only, next to port) |
| the other 37 gens (title_intro, seq_*, battle_*, ct_*, ow_*, dlg_cursor, menu_*) | gen/<name>.py, gen/xlat_all.py | generate | pending (oracle power-on) |
| pack-tables | gen/pack_tables.py pack | tail | pending (needs the C parser) |
| steam-margins | steam_wide.py | tail | pending |
| write-player-assets | gen/pack_tables.py into | tail | ported |

The `extract-assets` packers (24 `compile-*` calls inside extract_assets.build) are second-half work and are not listed
as stages of their own.
