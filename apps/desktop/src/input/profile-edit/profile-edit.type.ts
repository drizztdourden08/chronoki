/* @layer renderer-lib @kind types */
import type { FunctionAction, FunctionMapping, InputBinding, InputProfile, SnesButton } from '@chronoki/input-mapping';

interface BindMappingParams<T extends object> {
  mapping: T;
  binding: InputBinding;
  vid: string | null;
  pid: string | null;
}

interface BindSnesButtonParams {
  profile: InputProfile;
  button: SnesButton;
  binding: InputBinding;
  vid: string | null;
  pid: string | null;
}

interface ClearSnesMappingParams {
  profile: InputProfile;
  button: SnesButton;
  mappingIndex: number;
}

interface BindFunctionActionParams {
  mappings: readonly FunctionMapping[];
  action: FunctionAction;
  binding: InputBinding;
  vid: string | null;
  pid: string | null;
}

interface DevicePreset {
  sdlType: string;
  deviceName: string;
  vid: string;
  pid: string;
}

export type { BindFunctionActionParams, BindMappingParams, BindSnesButtonParams, ClearSnesMappingParams, DevicePreset };
