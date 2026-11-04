/* @layer renderer-components @kind component */
import { useCallback, useState } from 'react';
import { ItemList } from '@drizztdourden08/tessera/composites';
import type { ItemListRowState } from '@drizztdourden08/tessera/composites';
import type { NamedSaveEntry } from '@drizztdourden08/brock-port-kit';
import { SaveRowActions } from '@app/compounds/SaveRowActions';
import { useArmedRow } from '../behavior/useArmedRow';
import { useAutoSaves } from '../behavior/useAutoSaves';
import { autoTriggerLabel } from '../behavior/auto-trigger-label';
import { saveRowParts } from '../behavior/save-row-parts';
import type { HomeSectionProps } from '../HomeTab.type';

const idOf = (save: NamedSaveEntry) => save.id;
const nameOf = (save: NamedSaveEntry) => autoTriggerLabel(save.name);

const AutoSavesSection = ({ profileId, running }: HomeSectionProps) => {
  const { saves, screenshots, busyId, load, remove } = useAutoSaves(profileId, running);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { armedOf, reportArmed } = useArmedRow();

  const render = useCallback((save: NamedSaveEntry) => saveRowParts({
    screenshotUrl: screenshots[save.id] ?? null,
    savedAt: save.savedAt,
    busy: busyId === save.id,
    armed: armedOf(save.id),
  }), [screenshots, busyId, armedOf]);

  const rowActions = useCallback((save: NamedSaveEntry, row: ItemListRowState) => (
    <SaveRowActions
      name={`auto-save ${autoTriggerLabel(save.name)}`}
      busy={busyId !== null}
      tabIndex={row.tabIndex}
      onLoad={() => void load(save.id)}
      onDelete={() => void remove(save.id)}
      onArmedChange={(armed) => reportArmed(save.id, armed)}
    />
  ), [busyId, load, remove, reportArmed]);

  return (
    <ItemList
      title="Auto-saves"
      items={saves}
      getId={idOf}
      getName={nameOf}
      render={render}
      rowActions={rowActions}
      actionVisibility="always"
      maxRows={6}
      selectedId={selectedId}
      onSelect={setSelectedId}
      empty="No auto-saves yet"
    />
  );
};

export { AutoSavesSection };
