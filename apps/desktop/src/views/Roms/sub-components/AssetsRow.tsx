/* @layer renderer-components @kind component */
import { Button, Flex, Icon, Text } from '@drizztdourden08/tessera/primitives';
import { formatBytes } from '@drizztdourden08/brock-core';
import { ROMS_TEXT } from '../Roms.constants';
import type { AssetsRowProps } from './AssetsRow.type';

const AssetsRow = ({ rom, busy, refused, onRebuild }: AssetsRowProps) => {
  if (busy) return <Text tone="primary"><Icon name="refresh-cw" inline /> {ROMS_TEXT.extracting}</Text>;
  if (!rom.ready) {
    return <Button variant="primary" size="sm" disabled={refused} onClick={() => onRebuild(rom.romFile)}>{ROMS_TEXT.extractAssets}</Button>;
  }
  return (
    <Flex direction="row" gap="sm">
      <Text tone="secondary"><Icon name="check" inline /> {ROMS_TEXT.extracted}{rom.assetBytes ? ` (${formatBytes(rom.assetBytes)})` : ''}</Text>
      <Button variant="secondary" size="sm" disabled={refused} onClick={() => onRebuild(rom.romFile)}>{ROMS_TEXT.rebuild}</Button>
    </Flex>
  );
};

export { AssetsRow };
