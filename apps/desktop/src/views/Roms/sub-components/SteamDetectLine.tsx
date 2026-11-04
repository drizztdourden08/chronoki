/* @layer renderer-components @kind component */
import { Button, Flex, Text } from '@drizztdourden08/tessera/primitives';
import { STEAM_TEXT } from '../Roms.constants';
import type { SteamDetectLineProps } from './SteamDetectLine.type';

const SteamDetectLine = ({ status, busy, onImport, onCancel, onRescan }: SteamDetectLineProps) => {
  if (status.state === 'scanning') {
    return (
      <Flex direction="row">
        <Text>{STEAM_TEXT.scanning}</Text>
        <Button variant="secondary" size="sm" onClick={onCancel}>{STEAM_TEXT.cancel}</Button>
      </Flex>
    );
  }
  if (status.state === 'found') {
    return (
      <Flex direction="row">
        <Text>{STEAM_TEXT.found} {status.path}</Text>
        <Button variant="primary" size="sm" disabled={busy} onClick={onImport}>{STEAM_TEXT.import}</Button>
      </Flex>
    );
  }
  if (status.state === 'idle') return null;
  return (
    <Flex direction="row">
      <Text>{status.state === 'cancelled' ? STEAM_TEXT.cancelled : STEAM_TEXT.notFound}</Text>
      <Button variant="secondary" size="sm" onClick={onRescan}>{STEAM_TEXT.rescan}</Button>
    </Flex>
  );
};

export { SteamDetectLine };
