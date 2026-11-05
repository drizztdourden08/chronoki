/* @layer bridge-wasm @kind constants */
import { CT_KIT } from '../ct-kit.constants';
import type { CtCharacter } from '../ct-world-keys.type';
import type { CtRecruit } from './ct-recruit.type';

const { all, has, option, region, when } = CT_KIT;

const CT_RECRUITS: Readonly<Record<CtCharacter, CtRecruit>> = {
  crono: { region: 'death-peak' },
  marle: { region: 'middle-ages' },
  frog: { region: 'middle-ages' },
  lucca: { region: 'middle-ages' },
  robo: { region: 'future', rule: when(option('lockedCharacters', true), region('future'), all()) },
  ayla: { region: 'prehistory', rule: when(option('lockedCharacters', true), has('dreamstone'), all()) },
  magus: null,
};

const CT_RECRUIT_ORDER: readonly CtCharacter[] = ['crono', 'marle', 'frog', 'lucca', 'robo', 'ayla', 'magus'];

export { CT_RECRUIT_ORDER, CT_RECRUITS };
