/* @layer bridge-wasm @kind constants */
const HECKRAN = 169;
const DRAGON_TANK_PARTS = [147, 148, 173];
const YAKRA_XIII = 199;
const GIGA_GAIA_PARTS = [209, 210, 211];
const GUARDIAN_AND_BIT = [212, 207];
const ZOMBOR_PARTS = [179, 180, 181, 182];
const MASA_MUNE_PARTS = [151, 152, 153];
const SON_OF_SUN_AND_FLAMES = [246, 247];
const MOTHER_BRAIN_AND_DISPLAYS = [190, 183];
const RETINITE = 58;
const GIGASAUR = 170;
const OZZIE_FORT_BOSSES = [160, 165, 168, 186, 187];
const NIZBEL = 155;

const BOSS_SPOT_ENEMIES: Readonly<Record<string, readonly number[]>> = {
  'ki-taban': [HECKRAN],
  'ki-kings-trial': [...DRAGON_TANK_PARTS, YAKRA_XIII],
  'ki-mt-woe': GIGA_GAIA_PARTS,
  'ki-arris-dome': GUARDIAN_AND_BIT,
  'ki-zenan-bridge': ZOMBOR_PARTS,
  'ki-denadoro-mts': MASA_MUNE_PARTS,
  'ki-sun-palace': SON_OF_SUN_AND_FLAMES,
  'ki-geno-dome': MOTHER_BRAIN_AND_DISPLAYS,
  'ki-sunken-desert': [RETINITE],
  'ki-giants-claw': [GIGASAUR],
  'ki-ozzies-fort': OZZIE_FORT_BOSSES,
  'ki-reptite-lair': [NIZBEL],
};

const YAKRA = 144;
const GOLEM = 149;
const AZALA = 154;
const NIZBEL_II = 156;
const SLASH = [157, 158];
const FLEA = 159;
const DALTON = [161, 162];
const METAL_MUTE = 164;
const OZZIE = [166, 167];
const TYRANO_BOSSES = [188, 189];
const ATROPOS_XR = 192;
const GOLEM_BOSS = 243;
const MAGUS = [249, 250];

const OTHER_BOSS_IDS: readonly number[] = [
  YAKRA, GOLEM, AZALA, NIZBEL_II, ...SLASH, FLEA, ...DALTON, METAL_MUTE, ...OZZIE, ...TYRANO_BOSSES, ATROPOS_XR, GOLEM_BOSS, ...MAGUS,
];

const BOSS_SPOTS: readonly string[] = Object.keys(BOSS_SPOT_ENEMIES);

const BOSS_ENEMY_IDS: ReadonlySet<number> = new Set([...Object.values(BOSS_SPOT_ENEMIES).flat(), ...OTHER_BOSS_IDS]);

export { BOSS_ENEMY_IDS, BOSS_SPOT_ENEMIES, BOSS_SPOTS, OTHER_BOSS_IDS };
