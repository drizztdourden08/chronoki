// The save state layouts of the cores before per-section ids (I-77). Those stamped only a whole-state schema hash
// (`schema=`, no `sections=` line), so this table names, for each hash a release actually stamped, the per-section ids its
// sections had (state-stamp.mjs's sectionText over the field lists at that commit, CT_STATE_VERSION 4). A loader takes a
// state of one of these layouts section by section: it loads when every section it carries has today's id.
//
// Frozen: a hash is only ever added here for a core that shipped without `sections=`, which no core after 0.4.1 does.
// Derivation (sha256 hex, the schema 16 chars, the ids 8): the schema text is state-stamp.mjs's schemaText at each commit;
// the ids hash 'CORE.1;wram=131072;sram=8192', 'SCEN.1;engine=4', 'HOST.1;<host list>', 'WRLD.1;<world lists>',
// 'MENU.1;<menu lists>;stash=24824', 'MPIC.1;rle3', 'APU.1' and 'APUH.1'.
const CORE = 'ebf41249';
const SCEN = '1d198e2e';
const HOST = '4e9f4c6d';
const WRLD = '5a91241a';
const MPIC = 'ed8b0fb8';
const APU = '3d41af6f';
const APUH = '34278248';
const MENU_040 = '1a286f40';   // dad6423: the menu lists before d3d0f5d added the field VRAM image (g_fieldVram, ...)
const MENU_040_VRAM = '6d2ad028';

const PAST_LAYOUTS = [
  { core: '0.1.0', schema: '6056af1ab794cc02', sections: { CORE, SCEN, APU } },                          // a342f6b
  { core: '0.2.0', schema: 'bf464ae546a55749', sections: { CORE, SCEN, HOST, APU } },                    // 7fd56b3
  { core: '0.2.1', schema: 'af34a5e01abb9c1d', sections: { CORE, SCEN, HOST, APU, APUH } },              // 1140e0b
  { core: '0.3.0', schema: '7d9cc142d80fe9b7', sections: { CORE, SCEN, HOST, WRLD, APU, APUH } },        // b03f3af
  { core: '0.4.0', schema: 'b3044029289fd7ed', sections: { CORE, SCEN, HOST, WRLD, MENU: MENU_040, MPIC, APU, APUH } },
  { core: '0.4.0', schema: 'fd36cd328745135f', sections: { CORE, SCEN, HOST, WRLD, MENU: MENU_040_VRAM, MPIC, APU, APUH } },
];

export { PAST_LAYOUTS }
