// Build-time text patch for the game module's S-DSP (src/sound/mixer.c): one gain per voice group, so the music voices can be
// kept out of the output while the driver runs them untouched (the voice still advances: BRR, envelope, ENDX). Exact matches
// with an expected count; any mismatch stops the build (the datapack.c precedent in shapes.mjs). The import is never edited:
// the patched copy goes under out/gen/ and replaces src/sound/mixer.c in the game module only (the oracle keeps the original).
//  * voiceSample: after the voiceMask early return, s is scaled by g_ckGain[0] (music) or [1] (voices D_SFX_VOICES marks);
//    s feeds both mixL/mixR and the echo input, so both are scaled. 256 is unity: (s * 256) >> 8 == s, bit-identical.
//  * g_ckGain lives in reconnect/music_tap.c; it is not ARAM or machine state, so no save state contains it.
//  * driver.c's enum is checked for the ARAM addresses the music tap reads (reconnect/music_tap.c): D_SONG, D_SFX_VOICES,
//    and A_FADE ($F160, whose high byte $F161 is the music fade).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PINS = [['D_SONG', 0x80], ['D_SFX_VOICES', 0x86], ['A_FADE', 0xF160]];

const MASK_LINE = '  if (!(m->voiceMask & (1 << ch))) return;\n';
const GAIN_LINES = `${MASK_LINE}  { int g = (m->aram[0x86] >> ch & 1) ? g_ckGain[1] : g_ckGain[0]; s = (s * g) >> 8; }   /* ChronoKi: 256 = unchanged */\n`;

// [what to find, what to put, how many times it must occur]
const MIXER_PATCHES = [
  ['#include "mixer.h"\n', '#include "sound/mixer.h"\nextern int g_ckGain[2];\n', 1],
  [MASK_LINE, GAIN_LINES, 1],
];

// anchors that must still sit right after the patch point (the lines the gain feeds), so a reshuffle upstream is loud
const NEIGHBOURS = [
  '  m->mixL = clamp16(m->mixL + ((s * v->volL) >> 7));\n',
  '    m->echoInL = clamp16(m->echoInL + ((s * v->volL) >> 7));\n',
];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const applyPatches = (name, text, patches) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/mixer-gains.mjs`);
    }
    out = out.split(find).join(put);
  }
  for (const find of NEIGHBOURS) {
    if (occurrences(out, find) !== 1) throw new Error(`${name}: ${JSON.stringify(find)} not found once; the mix lines moved, update patches/mixer-gains.mjs`);
  }
  return out;
};

const checkDriverPins = (belthasar) => {
  const text = readFileSync(join(belthasar, 'src', 'sound', 'driver.c'), 'utf8').replace(/\r\n/g, '\n');
  for (const [name, value] of PINS) {
    const m = new RegExp(`\\b${name}\\s*=\\s*0x([0-9A-Fa-f]+)`).exec(text);
    if (!m || parseInt(m[1], 16) !== value) {
      throw new Error(`sound/driver.c: ${name} is not 0x${value.toString(16).toUpperCase()}; the music tap's ARAM addresses moved, update music_tap.c and patches/mixer-gains.mjs`);
    }
  }
};

// returns { files: [absolute path of the patched copy], replaced: ['src/sound/mixer.c'] }
const writeMixerGains = (genDir, belthasar) => {
  checkDriverPins(belthasar);
  const text = readFileSync(join(belthasar, 'src', 'sound', 'mixer.c'), 'utf8').replace(/\r\n/g, '\n');
  const dir = join(genDir, 'gains');
  mkdirSync(dir, { recursive: true });
  const file = join(dir, 'mixer.c');
  writeFileSync(file, applyPatches('mixer.c', text, MIXER_PATCHES));
  return { files: [file], replaced: ['src/sound/mixer.c'] };
};

export { writeMixerGains }
