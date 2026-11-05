// Build-time text patches for multiworld's death link (I-117 C4). The same contract as RotP's core/game-hooks/death_link.c
// on CT's engine (reconnect/ap_reconnect.c):
//  * Report: field.c, the battle game-over commit (outcome 1 with $2A1F bit 5 clear, the C0/02A0 defeat sequence) calls
//    ck_ap_party_wiped(): a CK_AP_EV_DEATH event, cause 1 when the host's kill caused the wipe, else 0.
//  * Kill: CkApKillParty() arms; the arm lands on the next battle frame. battle.c CtBattleTick's head (a fight still
//    running: no victory hold, defeat or flee) and CtBattleBegin's staging (next to the CT_BATTLE_PCHP test hook, which
//    writes the same curHP words for "a party wipe for the C0/02A0 game-over path") write 0 to every present PC's battle
//    curHP (kPcBlock + 3); the engine's own dead-flag sweep (C1/B223) and defeat then run. On the field the arm waits for
//    the next fight (Q2's default); with CkSetApKillLanding(1) field.c's main loop starts the defeat sequence at once.
//  * Gate: ck_ap_death_link() (CkSetApOnline and CkSetApDeathLink). Off, no call is made and the arm is dropped.
// Each anchor must match exactly once; any mismatch stops the build. Applied in place on the patched copies under out/gen/
// (field.c after duplicate-chars.mjs; battle.c after sightscope.mjs and duplicate-chars-battle.mjs). core/belthasar is
// never edited.
import { basename } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';

const FIELD_PATCHES = [
  ['      if (gameOver) *gameOver = 1;\n',
    '      if (gameOver) *gameOver = 1;\n'
      + '      if (ck_ap_death_link()) ck_ap_party_wiped();   /* [chronoki] multiworld death link: report the wipe */\n', 1],
  ['    if (gameOver) {\n      uint8_t* gw = CtWramSys(fieldWram());',
    '    if (!gameOver && !battlePhase && ck_ap_death_link() && ck_ap_field_kill_due()) gameOver = 1;   /* [chronoki] death link, landing 1 */\n'
      + '    if (gameOver) {\n      uint8_t* gw = CtWramSys(fieldWram());', 1],
];

const BATTLE_PATCHES = [
  ['  h->mem[0xA0B3] = 0;\n  // Test hook CT_BATTLE_CRONOHP',
    '  h->mem[0xA0B3] = 0;\n'
      + '  if (ck_ap_death_link()) ck_ap_kill_battle_begin(h->mem);   /* [chronoki] death link: an armed kill lands at staging */\n'
      + '  // Test hook CT_BATTLE_CRONOHP', 1],
  ['int CtBattleTick(CtBattleHost* h, int endRequest, int input) {\n  int r = battleTickBody(h, endRequest, input);',
    'int CtBattleTick(CtBattleHost* h, int endRequest, int input) {\n'
      + '  if (h && h->mem && !h->victoryHold && !h->defeatT && !h->fleeTriggered && ck_ap_death_link())\n'
      + '    ck_ap_kill_battle_tick(h->mem);                          /* [chronoki] death link: an armed kill lands this frame */\n'
      + '  int r = battleTickBody(h, endRequest, input);', 1],
];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/ap-death-link.mjs`);
    }
    out = out.split(find).join(put);
  }
  return out;
};

const INCLUDE = '#include "ck_reconnect.h"\n';
const withInclude = (text) => (text.includes(INCLUDE) ? text : INCLUDE + text);

const patchFile = (file, name, patches) =>
  writeFileSync(file, applyPatches(name, withInclude(readFileSync(file, 'utf8').replace(/\r\n/g, '\n')), patches));

// `state` is writeStatePatches' result (field.c patched in place); `sight` is writeDuplicateCharsBattle's result (its
// battle.c is the game module's copy, patched in place).
const writeApDeathLink = (state, sight) => {
  const field = state.files.find((f) => /[\\/]field\.c$/.test(f));
  if (!field) throw new Error('ap-death-link: no patched field.c from state-patches.mjs');
  const battle = sight.files.find((f) => basename(f) === 'battle.c');
  if (!battle) throw new Error('ap-death-link: no patched battle.c from sightscope.mjs / duplicate-chars-battle.mjs');
  patchFile(field, 'field.c', FIELD_PATCHES);
  patchFile(battle, 'battle.c', BATTLE_PATCHES);
  return { patches: FIELD_PATCHES.length + BATTLE_PATCHES.length, files: [field, battle] };
};

export { BATTLE_PATCHES as AP_DEATH_BATTLE_PATCHES, FIELD_PATCHES as AP_DEATH_FIELD_PATCHES, writeApDeathLink };
