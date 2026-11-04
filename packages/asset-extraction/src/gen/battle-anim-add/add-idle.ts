/* @layer shared-asset-extraction @kind logic */
import type { ImportContext } from '../../pipeline/import-context.type';
import { peekOracle } from '../../oracle/peek-access';
import { BRACKET_TILE, GATO_REF } from '../battle-anim/anim-consts.constants';
import { parseMonitor } from '../battle-anim/parse-monitor';
import { monitorRequest } from '../battle-anim/monitor-request';
import { inView } from '../battle-anim/in-view';
import type { GatoStep } from '../battle-anim/anim-tables.type';
import type { SavingDump, PokeMonitorRequest } from './add-idle.type';
import { GATO_V2_F0, GATO_V2_F1, NOATK_POKE, SAVED_STATE } from './add-idle.constants';

const makeIdleState = async (ctx: ImportContext, state: Uint8Array): Promise<Uint8Array> => {
  const dump: SavingDump = await peekOracle(ctx).peek({
    state,
    script: '100:8,0:392',
    env: { PEEK_SAVE: SAVED_STATE },
  });
  if (!dump.state) throw new Error('battle_anim_add: the oracle driver did not return the PEEK_SAVE state');
  return dump.state;
};

const gatoIdleNoAttack = async (ctx: ImportContext, state: Uint8Array): Promise<GatoStep[]> => {
  const idle = await makeIdleState(ctx, state);
  const req: PokeMonitorRequest = {
    ...monitorRequest(idle, `100:0,0:${GATO_V2_F1 + 4}`),
    env: { PEEK_POKE: NOATK_POKE },
  };
  const frames = parseMonitor(await peekOracle(ctx).monitor(req));
  const rows: GatoStep[] = [];
  for (let F = GATO_V2_F0; F <= GATO_V2_F1; F += 1) {
    const sprites = frames.get(F);
    if (!sprites) continue;
    const on = sprites.filter((s) => inView(s) && s.pal === 1 && s.tile !== BRACKET_TILE);
    if (!on.length) continue;
    const ax = Math.min(...on.map((s) => s.x));
    const ay = Math.min(...on.map((s) => s.y));
    const c68 = on.find((s) => s.tile === 0x68);
    const arm = c68 && c68.y - ay > 25 ? 1 : 0;
    rows.push([F, ax - GATO_REF[0], ay - GATO_REF[1], arm, 0]);
  }
  return rows;
};

export { gatoIdleNoAttack };
