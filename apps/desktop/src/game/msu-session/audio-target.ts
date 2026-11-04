/* @layer bridge-wasm @kind logic */
import type { MsuHost } from '@drizztdourden08/brock-msu';
import { activeGameHolder } from '../lifecycle/active-game-holder';

const audioTarget: MsuHost['audioTarget'] = () => {
  const out = activeGameHolder.current?.session.audio.output();
  return out ? { ctx: out.context, node: out.node } : null;
};

export { audioTarget };
