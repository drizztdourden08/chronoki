/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { Roms } from '@app/views/Roms';

const meta: ScreenMeta = { title: 'ROMs', icon: 'gamepad-2', showHeader: true, fill: true, order: 2, keywords: ['rom', 'import', 'extract', 'assets', 'rebuild', 'sfc', 'smc', 'cartridge', 'library'] };

const RomsPage = () => <Roms />;

export default RomsPage;
export { meta };
