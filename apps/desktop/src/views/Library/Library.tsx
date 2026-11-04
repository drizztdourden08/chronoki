/* @layer renderer-components @kind component */
import { DropZone, EmptyState, Icon, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { formatBytes } from '@drizztdourden08/brock-core';
import { LIBRARY_TEXT, ROM_ACCEPT } from './Library.constants';
import { useLibrary } from './behavior/useLibrary';

const Library = () => {
  const { roms, status, handleDrop } = useLibrary();
  return (
    <Stack>
      <Text variant="body">{LIBRARY_TEXT.intro}</Text>
      <Text as="h3" variant="title">{LIBRARY_TEXT.importTitle}</Text>
      <DropZone accept={ROM_ACCEPT} label={LIBRARY_TEXT.dropLabel} hint={LIBRARY_TEXT.dropHint} onDrop={handleDrop} />
      {status && <Text variant="body">{status.message}</Text>}
      <Text as="h3" variant="title">{LIBRARY_TEXT.listTitle}</Text>
      {roms.length === 0 && <EmptyState message={LIBRARY_TEXT.empty} />}
      {roms.map((rom) => (
        <ListItemRow
          key={rom.romFile}
          icon={<Icon name="gamepad-2" />}
          name={rom.romFile}
          meta={rom.bytes ? formatBytes(rom.bytes) : ''}
        />
      ))}
    </Stack>
  );
};

export { Library };
