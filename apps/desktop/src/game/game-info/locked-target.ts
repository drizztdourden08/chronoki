/* @layer bridge-wasm @kind logic */
import { searchIndex } from '../../../.brock/search';
import { GAME_INFO_FALLBACK_TARGET, GAME_INFO_SETTING_KEY } from './game-info.constants';

const lockedTarget = (): string => {
  const target = searchIndex.find((candidate) => candidate.target?.anchor === GAME_INFO_SETTING_KEY)?.target;
  return target ? `${target.route}#${GAME_INFO_SETTING_KEY}` : GAME_INFO_FALLBACK_TARGET;
};

export { lockedTarget };
