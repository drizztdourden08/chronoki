/* @layer renderer-components @kind component */
import { formatBytes } from '@drizztdourden08/brock-core';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { ROMS_TEXT } from '../Roms.constants';
import type { RomEntry } from '../Roms.type';

const ExtractionMeta = ({ rom }: { rom: RomEntry }) => (
  <>
    {rom.ready && <Icon name="check" inline />}
    {rom.ready ? ` ${ROMS_TEXT.assetsExtracted}` : ROMS_TEXT.noAssets}
    {rom.assetBytes ? ` · ${formatBytes(rom.assetBytes)}` : ''}
  </>
);

export { ExtractionMeta };
