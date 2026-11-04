/* @layer renderer-lib @kind logic */
import type { InputBinding } from '@chronoki/input-mapping';

const gamepadKeyOf = (binding: InputBinding): string | null => {
  if (binding.type === 'gamepad-button') return `button:${binding.index}`;
  if (binding.type === 'gamepad-axis') return `axis:${binding.axisIndex}:${binding.direction}`;
  return null;
};

const sameGamepadInput = (a: InputBinding, b: InputBinding): boolean => {
  const key = gamepadKeyOf(a);
  return key !== null && key === gamepadKeyOf(b);
};

export { sameGamepadInput };
