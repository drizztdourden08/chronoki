/* @layer renderer-widgets @kind component */
import { CheatsShell } from '@drizztdourden08/brock-game-info/renderer';
import type { CheatsTab } from '@drizztdourden08/brock-game-info/renderer';
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import { useCheatSnapshot } from './behavior/useCheatSnapshot';
import { ItemsGoldTab } from './sub-components/ItemsGoldTab';
import { PartyTab } from './sub-components/PartyTab';
import { DEFAULT_TAB, NOT_RUNNING_TEXT, OFF_REASON } from './CheatsWidget.constants';

const CheatsWidgetContent = () => {
  const snapshot = useCheatSnapshot();
  const waiting = () => <EmptyState message={NOT_RUNNING_TEXT} />;
  const tabs: readonly CheatsTab[] = [
    { id: 'items', label: 'Items and gold', render: () => (snapshot ? <ItemsGoldTab snapshot={snapshot} /> : waiting()) },
    { id: 'party', label: 'Party', render: () => (snapshot ? <PartyTab snapshot={snapshot} /> : waiting()) },
  ];
  return <CheatsShell tabs={tabs} enabled offReason={OFF_REASON} defaultTab={DEFAULT_TAB} />;
};

export { CheatsWidgetContent };
