// Build-time text patch for the game module's S-DSP (src/sound/mixer.c): one gain per voice group, so the music voices can be
// kept out of the output while the driver runs them untouched (the voice still advances: BRR, envelope, ENDX). Exact matches
// with an expected count; any mismatch stops the build (the datapack.c precedent in shapes.mjs). The import is never edited:
// the patched copy goes under out/gen/ and replaces src/sound/mixer.c in the game module only (the oracle keeps the original).
//  * voiceSample: after the voiceMask early return, s is scaled by g_ckGain[0] (music) or [1] (voices D_SFX_VOICES marks);
//    s feeds both mixL/mixR and the echo input, so both are scaled. 256 is unity: (s * 256) >> 8 == s, bit-identical.
//  * echoSample: the FIR output (sumL/sumR) is scaled by the music gain before it is mixed in and fed back, so the music already in
//    the echo buffer dies at once instead of ringing out through the feedback. 256 is unity; the effects' own echo (EON of the
//    effect voices) is scaled with it, which is the price of one gain.
//  * the vendored S-DSP (snes/dsp.c) is patched the same way: audio.c runs it (not the mixer) for the seeded stretch before the machine
//    takes over at $0299 and for CT_AUDIO_SPC=ref, and the intro is such a stretch; left alone it passed music at full gain.
//  * g_ckGain lives in reconnect/music_tap.c; it is not ARAM or machine state, so no save state contains it.
//  * driver.c's enum is checked for the ARAM addresses the music tap reads (reconnect/music_tap.c): D_SONG, D_SFX_VOICES,
//    and A_FADE ($F160, whose high byte $F161 is the music fade).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PINS = [['D_SONG', 0x80], ['D_SFX_VOICES', 0x86], ['A_FADE', 0xF160]];

const MASK_LINE = '  if (!(m->voiceMask & (1 << ch))) return;\n';
const GAIN_LINES = `${MASK_LINE}  { int g = (m->aram[0x86] >> ch & 1) ? g_ckGain[1] : g_ckGain[0]; s = (s * g) >> 8; }   /* ChronoKi: 256 = unchanged */\n`;

const ECHO_CLAMP = '  sumL = clamp16(sumL) & ~1;\n  sumR = clamp16(sumR) & ~1;\n';
const ECHO_GAIN = '  sumL = (sumL * g_ckGain[0]) >> 8; sumR = (sumR * g_ckGain[0]) >> 8;   /* ChronoKi: 256 = unchanged */\n';
const DSP_VOICE_LINE = '  dsp->sampleOutL = clamp16(dsp->sampleOutL + ((sample * dsp->channel[ch].volumeL) >> 7));\n';
const DSP_GAIN_LINE = '  { int g = (dsp->apu->ram[0x86] >> ch & 1) ? g_ckGain[1] : g_ckGain[0]; sample = (sample * g) >> 8; }   /* ChronoKi: 256 = unchanged */\n';

// [what to find, what to put, how many times it must occur]
const MIXER_PATCHES = [
  ['#include "mixer.h"\n', '#include "sound/mixer.h"\nextern int g_ckGain[2];\n', 1],
  [MASK_LINE, GAIN_LINES, 1],
  [ECHO_CLAMP, ECHO_CLAMP + ECHO_GAIN, 1],
];

const DSP_PATCHES = [
  ['#include "statehandler.h"\n', '#include "statehandler.h"\nextern int g_ckGain[2];\n', 1],
  [DSP_VOICE_LINE, DSP_GAIN_LINE + DSP_VOICE_LINE, 1],
  [ECHO_CLAMP, ECHO_CLAMP + ECHO_GAIN, 1],
];

// anchors that must still sit right after the patch point (the lines the gain feeds), so a reshuffle upstream is loud
const NEIGHBOURS = [
  '  m->mixL = clamp16(m->mixL + ((s * v->volL) >> 7));\n',
  '    m->echoInL = clamp16(m->echoInL + ((s * v->volL) >> 7));\n',
  '  m->mixL = clamp16(((m->mixL * m->mainVolL) >> 7) + ((sumL * m->echoVolL) >> 7));\n',
];

const occurrences = (text, find) => (find ? text.split(find).length - 1 : 0);

const DSP_NEIGHBOURS = [
  '    dsp->echoOutL = clamp16(dsp->echoOutL + ((sample * dsp->channel[ch].volumeL) >> 7));\n',
  '  dsp->sampleOutL = clamp16(((dsp->sampleOutL * dsp->masterVolumeL) >> 7) + ((sumL * dsp->echoVolumeL) >> 7));\n',
];

const applyPatches = (name, text, patches, neighbours) => {
  let out = text;
  for (const [find, put, count] of patches) {
    const found = occurrences(out, find);
    if (found !== count) {
      throw new Error(`${name}: expected ${count} match(es) of ${JSON.stringify(find)}, found ${found}; upstream changed, update patches/mixer-gains.mjs`);
    }
    out = out.split(find).join(put);
  }
  for (const find of neighbours) {
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

// returns { files: [absolute paths of the patched copies], replaced: ['src/sound/mixer.c', 'snes/dsp.c'] }
const readLf = (belthasar, ...parts) => readFileSync(join(belthasar, ...parts), 'utf8').replace(/\r\n/g, '\n');

const writeMixerGains = (genDir, belthasar) => {
  checkDriverPins(belthasar);
  const dir = join(genDir, 'gains');
  mkdirSync(dir, { recursive: true });
  const mixer = join(dir, 'mixer.c');
  const dsp = join(dir, 'dsp.c');
  writeFileSync(mixer, applyPatches('mixer.c', readLf(belthasar, 'src', 'sound', 'mixer.c'), MIXER_PATCHES, NEIGHBOURS));
  writeFileSync(dsp, applyPatches('dsp.c', readLf(belthasar, 'snes', 'dsp.c'), DSP_PATCHES, DSP_NEIGHBOURS));
  return { files: [mixer, dsp], replaced: ['src/sound/mixer.c', 'snes/dsp.c'] };
};

export { writeMixerGains }
