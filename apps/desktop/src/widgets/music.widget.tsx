/* @layer renderer-widgets @kind component */
import { MUSIC_DEBUGGER_META, MsuStudioProvider, MusicDebuggerWidget } from '@drizztdourden08/brock-msu/renderer';
import { chronokiMsuStudio } from '@app/game/msu-studio';

const meta = MUSIC_DEBUGGER_META;

const MusicWidget = () => (
  <MsuStudioProvider game={chronokiMsuStudio}>
    <MusicDebuggerWidget />
  </MsuStudioProvider>
);

export default MusicWidget;
export { meta };
