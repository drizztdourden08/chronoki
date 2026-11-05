/* @layer bridge-wasm @kind logic */
import type { CtCharacter } from '../ct-world-keys.type';
import type { CtModeDef } from '../modes/ct-mode-def.type';
import { CT_REGIONS } from '../regions/ct-regions.constants';
import type { CharacterAssignment } from './character-assignment.type';
import { CHARACTER_RANDO_SPOTS } from './character-rando.constants';
import { CT_RECRUIT_SPOTS } from './ct-recruit-spots.constants';

const spotKeptBy = (mode: CtModeDef, spot: CtCharacter): boolean => {
  const region = CT_RECRUIT_SPOTS[spot]?.region;
  const spec = CT_REGIONS.find((candidate) => candidate.id === region);
  return spec !== undefined && mode.eras.includes(spec.era) && !(mode.removedRegions ?? []).includes(spec.id);
};

const swapIntoKeptSpot = (assignment: CharacterAssignment, mode: CtModeDef, character: CtCharacter): CharacterAssignment => {
  const required = mode.requiredCharacters ?? [];
  const from = CHARACTER_RANDO_SPOTS.find((spot) => assignment[spot] === character);
  if (from === undefined || spotKeptBy(mode, from)) return assignment;
  const to = CHARACTER_RANDO_SPOTS.find((spot) => {
    const occupant = assignment[spot];
    return spotKeptBy(mode, spot) && occupant !== undefined && !required.includes(occupant);
  });
  if (to === undefined) return assignment;
  return { ...assignment, [from]: assignment[to], [to]: character };
};

const keepRequiredRecruits = (assignment: CharacterAssignment, mode: CtModeDef): CharacterAssignment =>
  (mode.requiredCharacters ?? []).reduce((current, character) => swapIntoKeptSpot(current, mode, character), assignment);

export { keepRequiredRecruits };
