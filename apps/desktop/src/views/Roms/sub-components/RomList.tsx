/* @layer renderer-components @kind component */
import { EmptyState, Icon, IconButton, Stack } from '@drizztdourden08/tessera/primitives';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { formatBytes } from '@drizztdourden08/brock-core';
import { ROMS_TEXT } from '../Roms.constants';
import type { RomListProps } from './RomList.type';

const metaOf = (ready: boolean, bytes: number | null): string =>
  ready ? `${ROMS_TEXT.ready}${bytes ? ` - ${formatBytes(bytes)}` : ''}` : ROMS_TEXT.notBuilt;

const RomList = ({ roms, selected, busy, onSelect, onDelete }: RomListProps) => (
  <Stack gap="xs">
    {roms.length === 0 && <EmptyState message={ROMS_TEXT.empty} />}
    {roms.map((rom) => (
      <ListItemRow
        key={rom.romFile}
        icon={<Icon name="gamepad-2" />}
        name={rom.romFile}
        selected={selected === rom.romFile}
        onClick={() => onSelect(rom.romFile)}
        meta={metaOf(rom.ready, rom.assetBytes)}
        action={
          <IconButton
            variant="ghost"
            size="sm"
            label={ROMS_TEXT.deleteLabel}
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(rom.romFile);
            }}
          >
            <Icon name="x" />
          </IconButton>
        }
      />
    ))}
  </Stack>
);

export { RomList };
