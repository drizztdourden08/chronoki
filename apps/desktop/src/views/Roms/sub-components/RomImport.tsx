/* @layer renderer-components @kind component */
import { DropZone, Field, Text } from '@drizztdourden08/tessera/primitives';
import { ROMS_TEXT, ROM_ACCEPT } from '../Roms.constants';
import type { RomImportProps } from './RomImport.type';

const RomImport = ({ busy, status, onDrop }: RomImportProps) => (
  <>
    <Field hint={ROMS_TEXT.importHint} width="full">
      {!busy && <DropZone accept={ROM_ACCEPT} label={ROMS_TEXT.dropLabel} hint={ROMS_TEXT.dropHint} onDrop={onDrop} />}
    </Field>
    {status && <Text variant="body">{status.message}</Text>}
  </>
);

export { RomImport };
