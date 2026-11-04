/* @layer renderer-components @kind component */
import { useCallback, useState } from 'react';
import { ItemList } from '@drizztdourden08/tessera/composites';
import type { ItemListCreate, ItemListRowState } from '@drizztdourden08/tessera/composites';
import type { NamedSaveEntry } from '@drizztdourden08/brock-port-kit';
import { SaveRowActions } from '@app/compounds/SaveRowActions';
import { useArmedRow } from '../behavior/useArmedRow';
import { saveRowParts } from '../behavior/save-row-parts';
import { NO_GAME_REASON } from '../HomeTab.constants';
import type { NormalSavesSectionProps } from '../HomeTab.type';
import { CreateSaveForm } from './CreateSaveForm';

const idOf = (save: NamedSaveEntry) => save.id;
const nameOf = (save: NamedSaveEntry) => save.name;

const NormalSavesSection = ({ normal, running }: NormalSavesSectionProps) => {
  const { saves, screenshots, busyId, create, load, overwrite, remove, rename } = normal;
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
      name={save.name}
      busy={busyId !== null}
      tabIndex={row.tabIndex}
      overwriteDisabledReason={running ? undefined : NO_GAME_REASON}
      onLoad={() => void load(save.id)}
      onOverwrite={() => void overwrite(save.id)}
      onDelete={() => void remove(save.id)}
      onArmedChange={(armed) => reportArmed(save.id, armed)}
    />
  ), [busyId, running, load, overwrite, remove, reportArmed]);

  const createForm = useCallback<ItemListCreate>((close) => {
    const handleCreate = (name: string) => {
      void create(name).then((id) => {
        if (id) setSelectedId(id);
        close();
      });
    };
    return <CreateSaveForm onCreate={handleCreate} onCancel={close} />;
  }, [create]);

  const handleRename = useCallback((id: string, name: string) => void rename(id, name), [rename]);

  return (
    <ItemList
      title="Saves"
      items={saves}
      getId={idOf}
      getName={nameOf}
      render={render}
      rowActions={rowActions}
      actionVisibility="always"
      maxRows={6}
      create={createForm}
      newDisabled={running ? false : NO_GAME_REASON}
      createLabel="New save"
      selectedId={selectedId}
      onSelect={setSelectedId}
      onRename={handleRename}
      renameInline
      empty="No saves yet"
    />
  );
};

export { NormalSavesSection };
