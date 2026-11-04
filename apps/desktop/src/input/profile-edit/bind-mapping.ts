/* @layer renderer-lib @kind logic */
import type { BindMappingParams } from './profile-edit.type';

const bindMapping = <T extends object>({ mapping, binding, vid, pid }: BindMappingParams<T>) => {
  const fromDevice = binding.type !== 'keyboard' && binding.type !== 'none';
  return {
    ...mapping,
    binding,
    icon: null,
    sourceVid: fromDevice ? vid : null,
    sourcePid: fromDevice ? pid : null,
  };
};

export { bindMapping };
