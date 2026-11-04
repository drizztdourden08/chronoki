/* @layer renderer-app @kind logic */
import { nav, openSearchTarget } from '@drizztdourden08/brock-react';
import { searchIndex } from '../../.brock/search';
import { GAMEPLAY_SCREEN } from './settings-nav.constants';

const openSetting = (key: string): void => {
  const entry = searchIndex.find((candidate) => candidate.target?.anchor === key);
  if (entry?.target) openSearchTarget(entry.target, entry.label);
  else nav.open(GAMEPLAY_SCREEN);
};

export { openSetting };
