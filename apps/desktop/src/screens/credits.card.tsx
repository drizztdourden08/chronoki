/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { CreditsPage } from '@app/views/CreditsPage';

const meta: ScreenMeta = { title: 'Credits', icon: 'file-text', bare: true, requiresProfile: false, size: 'info', keywords: ['thanks', 'authors', 'licence', 'font'] };

const CreditsCard = () => <CreditsPage />;

export default CreditsCard;
export { meta };
