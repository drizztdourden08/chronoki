/* @layer renderer-lib @kind logic */
import type { InputBinding } from '@chronoki/input-mapping';
import { getButtonIconUrl } from '@app/input/button-icons/get-button-icon-url';
import { keyCodeToIconId } from '@chronoki/input-mapping';

const keyboardIconUrl = (binding: InputBinding): string | null => {
  if (binding.type !== 'keyboard') return null;
  const iconId = keyCodeToIconId(binding.code);
  return iconId ? getButtonIconUrl(iconId) : null;
};

export { keyboardIconUrl };
