/* @layer renderer-components @kind logic */
import { AUTO_TRIGGER_LABELS } from '../HomeTab.constants';

const autoTriggerLabel = (name: string): string => {
  const prefix = name.split(' ')[0]?.toLowerCase();
  if (prefix === 'quit') return AUTO_TRIGGER_LABELS.quit;
  if (prefix === 'timer' || prefix === 'auto') return AUTO_TRIGGER_LABELS.timer;
  return name;
};

export { autoTriggerLabel };
