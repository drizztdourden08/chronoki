/* @layer renderer-components @kind component */
import { Button, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { formatBytes } from '@drizztdourden08/brock-core';
import { ROMS_TEXT, VERDICT_LABEL, VERDICT_TONE } from '../Roms.constants';
import type { RomDetailProps } from './RomDetail.type';

const RomDetail = ({ rom, detail, loading, busy, onRebuild, onDelete }: RomDetailProps) => {
  if (loading) return <Text>Loading...</Text>;
  if (!detail) return <Text>{ROMS_TEXT.noInfo}</Text>;
  return (
    <Stack>
      <Text as="h3" variant="title">{rom.romFile}</Text>
      <Text>Check: <Status tone={VERDICT_TONE[detail.verdict]}>{VERDICT_LABEL[detail.verdict]}</Status></Text>
      {detail.identity && <Text>Game: {detail.identity}</Text>}
      {detail.size !== null && <Text>Size: {formatBytes(detail.size)}</Text>}
      <Text>SHA-1: {detail.hash}</Text>
      <Text>
        Assets: {rom.ready ? `${ROMS_TEXT.ready}${rom.assetBytes ? ` (${formatBytes(rom.assetBytes)})` : ''}` : ROMS_TEXT.notBuilt}
      </Text>
      <Stack direction="row">
        <Button variant="primary" size="sm" disabled={busy || detail.verdict === 'refused'} onClick={() => onRebuild(rom.romFile)}>
          {rom.ready ? ROMS_TEXT.rebuild : ROMS_TEXT.build}
        </Button>
        <Button variant="danger" size="sm" disabled={busy} onClick={() => onDelete(rom.romFile)}>{ROMS_TEXT.deleteLabel}</Button>
      </Stack>
    </Stack>
  );
};

export { RomDetail };
