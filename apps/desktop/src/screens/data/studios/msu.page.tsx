/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { MsuStudioPage } from '@drizztdourden08/brock-msu/renderer';
import { chronokiMsuStore, chronokiMsuStudio, confirmPackDelete } from '@app/game/msu-studio';

const meta: ScreenMeta = { title: 'MSU Studio', icon: 'headphones', showHeader: true, order: 1, fill: true, keywords: ['msu', 'music', 'soundtrack', 'pcm', 'tracks', 'msul', 'pack', 'optimize'] };

const noRefresh = (): void => undefined;

const MsuPage = () => (
  <MsuStudioPage
    game={chronokiMsuStudio}
    store={chronokiMsuStore()}
    onDeleteConfirm={confirmPackDelete}
    onRefresh={noRefresh}
  />
);

export default MsuPage;
export { meta };
