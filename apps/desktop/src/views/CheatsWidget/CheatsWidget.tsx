/* @layer renderer-widgets @kind component */
import { CheatsFrame } from '@drizztdourden08/brock-react';
import type { CheatsTabDef } from '@drizztdourden08/brock-react';
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import { useCheatSnapshot } from './behavior/useCheatSnapshot';
import { useSeedChecks } from './behavior/useSeedChecks';
import { ChecksTab } from './sub-components/ChecksTab/ChecksTab';
import { ItemsTab } from './sub-components/ItemsTab/ItemsTab';
import { PlayerTab } from './sub-components/PlayerTab/PlayerTab';
import { DEFAULT_TAB, NOT_RUNNING_TEXT } from './CheatsWidget.constants';
import './CheatsWidget.css';

const CheatsWidgetContent = () => {
  const snapshot = useCheatSnapshot();
  const checks = useSeedChecks();
  const waiting = <EmptyState message={NOT_RUNNING_TEXT} />;
  const tabs: CheatsTabDef[] = [
    { id: 'items', label: 'Items', content: snapshot ? <ItemsTab /> : waiting },
    { id: 'player', label: 'Player', content: snapshot ? <PlayerTab snapshot={snapshot} /> : waiting },
  ];
  if (checks) tabs.push({ id: 'checks', label: 'Checks', content: snapshot ? <ChecksTab rows={checks} /> : waiting });
  return <CheatsFrame tabs={tabs} defaultTab={DEFAULT_TAB} />;
};

export { CheatsWidgetContent };
