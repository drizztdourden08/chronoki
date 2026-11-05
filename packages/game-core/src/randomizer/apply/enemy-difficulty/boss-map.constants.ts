/* @layer bridge-wasm @kind constants */

// Enemy ids (battle table index) of the boss fight that guards each key-item spot; multi-part bosses list every part.
const BOSS_SPOT_ENEMIES: Readonly<Record<string, readonly number[]>> = {
  'ki-taban': [169], // Heckran
  'ki-kings-trial': [147, 148, 173, 199], // Dragon Tank (body, grinder, head), then Yakra XIII
  'ki-mt-woe': [209, 210, 211], // Giga Gaia (head, hands)
  'ki-arris-dome': [212, 207], // Guardian and its bit
  'ki-zenan-bridge': [179, 180, 181, 182], // Zombor (controller, parts)
  'ki-denadoro-mts': [151, 152, 153], // Masa, Mune, Masa & Mune
  'ki-sun-palace': [246, 247], // Son of Sun and its flames
  'ki-geno-dome': [190, 183], // Mother Brain and its displays
  'ki-sunken-desert': [58], // Retinite
  'ki-giants-claw': [170], // Gigasaur
  'ki-ozzies-fort': [160, 165, 168, 186, 187], // Flea Plus, Super Slash, Great Ozzie
  'ki-reptite-lair': [155], // Nizbel
};

// Bosses that guard no key-item spot: still never treated as regular enemies.
const OTHER_BOSS_IDS: readonly number[] = [
  144, // Yakra
  149, // Golem
  154, // Azala
  156, // Nizbel II
  157, 158, // Slash
  159, // Flea
  161, 162, // Dalton
  164, // Metal Mute
  166, 167, // Ozzie
  188, 189, // Black Tyrano, Rust Tyrano
  192, // Atropos XR
  243, // Golem Boss
  249, 250, // Magus
];

const BOSS_SPOTS: readonly string[] = Object.keys(BOSS_SPOT_ENEMIES);

const BOSS_ENEMY_IDS: ReadonlySet<number> = new Set([...Object.values(BOSS_SPOT_ENEMIES).flat(), ...OTHER_BOSS_IDS]);

export { BOSS_ENEMY_IDS, BOSS_SPOT_ENEMIES, BOSS_SPOTS, OTHER_BOSS_IDS };
