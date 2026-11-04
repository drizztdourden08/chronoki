/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { CreditsPage } from '@app/views/CreditsPage';

const meta: ScreenMeta = { title: 'Credits', icon: 'trophy', bare: true, requiresProfile: false, size: 'info', keywords: ['thanks', 'contributors', 'authors', 'licence', 'font'] };

const CreditsCard = () => <CreditsPage />;

export default CreditsCard;
export { meta };
