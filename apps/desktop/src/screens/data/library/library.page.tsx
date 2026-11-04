/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { Library } from '@app/views/Library';

const meta: ScreenMeta = { title: 'Library', icon: 'gamepad-2', order: 1, keywords: ['rom', 'import', 'sfc', 'smc', 'cartridge'] };

const LibraryPage = () => <Library />;

export default LibraryPage;
export { meta };
