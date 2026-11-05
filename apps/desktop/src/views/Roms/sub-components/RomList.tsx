/* @layer renderer-components @kind component */
import { EmptyState, Icon, IconButton, Stack, Status } from '@drizztdourden08/tessera/primitives';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { ROMS_TEXT } from '../Roms.constants';
import { ExtractionMeta } from './ExtractionMeta';
import type { RomListProps } from './RomList.type';

const RomList = ({ roms, selected, busy, onSelect, onDelete }: RomListProps) => (
  <Stack gap="xs">
    {roms.length === 0 && <EmptyState message={ROMS_TEXT.empty} />}
    {roms.map((rom) => (
      <ListItemRow
        key={rom.romFile}
        icon={<Icon name="gamepad-2" />}
        name={<>{rom.romFile} <Status tone="neutral">{ROMS_TEXT.kindBadge}</Status></>}
        selected={selected === rom.romFile}
        onClick={() => onSelect(rom.romFile)}
        meta={<ExtractionMeta rom={rom} />}
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
