/* @layer renderer-app @kind component */
import { useProduct } from '@drizztdourden08/brock-react';
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { Stack, Text } from '@drizztdourden08/tessera/primitives';

const meta: ScreenMeta = { title: 'Credits', icon: 'file-text', requiresProfile: false, size: 'info' };

const CreditsCard = () => {
  const product = useProduct();
  return (
    <Stack>
      <Text as="h2" variant="title">{product.name}</Text>
      <Text variant="body">An unofficial fan project, built on Brock with the Tessera design system. It contains no game data; you bring your own ROM. Chrono Trigger is a trademark of Square Enix.</Text>
    </Stack>
  );
};

export default CreditsCard;
export { meta };
