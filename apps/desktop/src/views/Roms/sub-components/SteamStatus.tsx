/* @layer renderer-components @kind component */
import { Button, Flex, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { formatBytes } from '@drizztdourden08/brock-core';
import { STEAM_TEXT } from '../Roms.constants';
import type { SteamStatusProps } from './SteamStatus.type';

const SteamStatus = ({ marker, busy, onRemove }: SteamStatusProps) => (
  <Stack>
    <Status tone="success">{STEAM_TEXT.imported}</Status>
    <Text>{STEAM_TEXT.importedOn}: {new Date(marker.builtAt).toLocaleString()}</Text>
    <Text>{STEAM_TEXT.source}: {marker.sourceName} ({formatBytes(marker.sourceBytes)})</Text>
    <Flex direction="row">
      <Button variant="danger" size="sm" disabled={busy} onClick={onRemove}>{STEAM_TEXT.removeLabel}</Button>
    </Flex>
  </Stack>
);

export { SteamStatus };
