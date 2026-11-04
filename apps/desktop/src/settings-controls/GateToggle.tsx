/* @layer renderer-app @kind component */
import { Toggle } from '@drizztdourden08/tessera/primitives';
import type { GateToggleProps } from './settings-controls.type';

const GateToggle = ({ id, settings, onChange }: GateToggleProps) => {
  const checked = settings.gates.includes(id);
  const toggle = (next: boolean): void => {
    const rest = settings.gates.filter((gate) => gate !== id);
    onChange({ gates: next ? [...rest, id] : rest });
  };
  return <Toggle checked={checked} onChange={toggle} />;
};

export { GateToggle };
