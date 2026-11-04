/* @layer renderer-components @kind logic */
import { getBindingLabel } from '@chronoki/input-mapping';
import { getInputManager } from '@app/input/input-manager/get-input-manager';

const shortcutLabel = (slot: number): string | undefined => {
  const mapping = getInputManager().getFunctionMappings().find((entry) => entry.action === `save-state-${slot + 1}`);
  if (!mapping || mapping.binding.type === 'none') return undefined;
  return getBindingLabel(mapping.binding, mapping.icon);
};

export { shortcutLabel };
