/* @layer bridge-wasm @kind type */
import type { chronokiCore } from '../../lifecycle/chronoki-core';

type ApCalls = ReturnType<typeof chronokiCore.calls>;

export type { ApCalls };
