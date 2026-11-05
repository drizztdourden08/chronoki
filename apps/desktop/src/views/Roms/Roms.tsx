/* @layer renderer-components @kind component */
import { useState } from 'react';
import { EmptyState, Stack } from '@drizztdourden08/tessera/primitives';
import { ListDetailLayout } from '@drizztdourden08/tessera/composites';
import { ROMS_TEXT, STEAM_TEXT } from './Roms.constants';
import type { RomsTab } from './Roms.tabs.type';
import { useRoms } from './behavior/useRoms';
import { RomDetail } from './sub-components/RomDetail';
import { RomImport } from './sub-components/RomImport';
import { RomList } from './sub-components/RomList';
import { RomsTabs } from './sub-components/RomsTabs';
import { SteamImport } from './sub-components/SteamImport';

const Roms = () => {
  const { roms, selected, setSelected, status, busy, detail, loading, handleDrop, handleRebuild, handleDelete } = useRoms();
  const [tab, setTab] = useState<RomsTab>('rom');
  const tabs = <RomsTabs value={tab} onChange={setTab} />;
  const rom = roms.find((entry) => entry.romFile === selected);
  const romContainers = [
    {
      title: ROMS_TEXT.importTitle,
      content: (
        <Stack>
          {tabs}
          <RomImport busy={busy} status={status} onDrop={handleDrop} />
        </Stack>
      ),
    },
    {
      title: ROMS_TEXT.listTitle,
      content: <RomList roms={roms} selected={selected} busy={busy} onSelect={setSelected} onDelete={handleDelete} />,
    },
  ];
  const steamContainers = [
    {
      title: STEAM_TEXT.title,
      content: (
        <Stack>
          {tabs}
          <SteamImport />
        </Stack>
      ),
    },
  ];
  return (
    <ListDetailLayout
      listShowTitle={false}
      listLabel={ROMS_TEXT.listLabel}
      listContainers={tab === 'rom' ? romContainers : steamContainers}
      detail={tab === 'rom' && rom ? <RomDetail rom={rom} detail={detail} loading={loading} busy={busy} onRebuild={handleRebuild} onDelete={handleDelete} /> : null}
      emptyDetail={<EmptyState message={ROMS_TEXT.noSelection} />}
    />
  );
};

export { Roms };
