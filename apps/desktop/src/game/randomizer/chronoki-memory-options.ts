/* @layer bridge-wasm @kind logic */
import type { CtMemoryOptions } from '@chronoki/game-core';
import { CK_EXPORT_WRAM_PTR } from '@chronoki/game-core';
import { chronokiCore } from '../lifecycle/chronoki-core';
import { LIVE_STATUSES } from '../game-info/game-info.constants';
import { onAnyLoad } from './on-any-load';

const calls = () => (LIVE_STATUSES.includes(chronokiCore.state().status) ? chronokiCore.calls() : null);

const chronokiMemoryOptions: CtMemoryOptions = {
  heap: () => calls()?.heap() ?? null,
  wramPtr: () => {
    const live = calls();
    return live?.has(CK_EXPORT_WRAM_PTR) ? live.number(CK_EXPORT_WRAM_PTR) : 0;
  },
  isLive: () => calls() !== null,
  onLoaded: onAnyLoad,
};

export { chronokiMemoryOptions };
