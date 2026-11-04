/* @layer bridge-wasm @kind logic */
import type { FlagProbe } from '@drizztdourden08/brock-randomizer/session';
import type { FlagProbe as CtFlagProbe } from './check.type';

const toFlagProbe = (probe: CtFlagProbe): FlagProbe =>
  probe.compare === 'set'
    ? { region: probe.region, offset: probe.offset, mask: probe.mask }
    : { custom: (view) => (view.byte(probe.region, probe.offset) & probe.mask) === 0 };

export { toFlagProbe };
