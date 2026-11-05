/* @layer renderer-widgets @kind component */
import { MUSIC_DEBUGGER_META, MsuStudioProvider, MusicDebuggerWidget } from '@drizztdourden08/brock-msu/renderer';
import { chronokiMsuStudio } from '@app/game/msu-studio';
import type { ChronokiMsuStudioGame } from '@app/game/msu-studio';

const meta = MUSIC_DEBUGGER_META;

const MusicWidget = () => (
  <MsuStudioProvider game={chronokiMsuStudio as ChronokiMsuStudioGame}>
    <MusicDebuggerWidget />
  </MsuStudioProvider>
);

export default MusicWidget;
export { meta };
