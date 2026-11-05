/* @layer renderer-app @kind logic */
import { GATE_KEY_PREFIX } from '@app/settings-controls/gate-keys.constants';
import { searchIndex } from '../../.brock/search';
import { VANILLA_SAFE_ID, WIDGET_GATE_FALLBACK_TARGET } from './widget-gates.constants';

const settingTarget = (settingId: string): string => {
  const anchor = settingId === VANILLA_SAFE_ID ? settingId : `${GATE_KEY_PREFIX}${settingId}`;
  const target = searchIndex.find((candidate) => candidate.target?.anchor === anchor)?.target;
  return target ? `${target.route}#${anchor}` : WIDGET_GATE_FALLBACK_TARGET;
};

export { settingTarget };
