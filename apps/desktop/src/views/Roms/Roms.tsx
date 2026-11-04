/* @layer renderer-components @kind component */
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import { ListDetailLayout } from '@drizztdourden08/tessera/composites';
import { ROMS_TEXT } from './Roms.constants';
import { useRoms } from './behavior/useRoms';
import { RomDetail } from './sub-components/RomDetail';
import { RomImport } from './sub-components/RomImport';
import { RomList } from './sub-components/RomList';

const Roms = () => {
  const { roms, selected, setSelected, status, busy, detail, loading, handleDrop, handleRebuild, handleDelete } = useRoms();
  const rom = roms.find((entry) => entry.romFile === selected);
  return (
    <ListDetailLayout
      listShowTitle={false}
      listLabel={ROMS_TEXT.listLabel}
      listContainers={[
        { title: ROMS_TEXT.importTitle, content: <RomImport busy={busy} status={status} onDrop={handleDrop} /> },
        {
          title: ROMS_TEXT.listTitle,
          content: <RomList roms={roms} selected={selected} busy={busy} onSelect={setSelected} onDelete={handleDelete} />,
        },
      ]}
      detail={rom ? <RomDetail rom={rom} detail={detail} loading={loading} busy={busy} onRebuild={handleRebuild} onDelete={handleDelete} /> : null}
      emptyDetail={<EmptyState message={ROMS_TEXT.noSelection} />}
    />
  );
};

export { Roms };
