/* @layer renderer-components @kind component */
import { Button, Flex, Text } from '@drizztdourden08/tessera/primitives';
import { STEAM_TEXT } from '../Roms.constants';
import type { SteamDetectLineProps } from './SteamDetectLine.type';

const messageOf = (status: SteamDetectLineProps['status']): string | null => {
  if (status.state === 'scanning') return STEAM_TEXT.scanning;
  if (status.state === 'found') return `${STEAM_TEXT.found} ${status.path}`;
  if (status.state === 'cancelled') return STEAM_TEXT.cancelled;
  if (status.state === 'idle') return null;
  return STEAM_TEXT.notFound;
};

const SteamDetectLine = ({ status, busy, onImport, onCancel, onRescan, onBrowse }: SteamDetectLineProps) => {
  const message = messageOf(status);
  const scanning = status.state === 'scanning';
  const found = status.state === 'found';
  return (
    <Flex direction="column" gap="sm">
      {message && <Text>{message}</Text>}
      {!busy && (
        <Flex direction="row" gap="sm" wrap>
          {found && <Button variant="primary" size="sm" onClick={onImport}>{STEAM_TEXT.import}</Button>}
          {scanning ? (
            <Button variant="secondary" size="sm" onClick={onCancel}>{STEAM_TEXT.cancel}</Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={onRescan}>{STEAM_TEXT.rescan}</Button>
          )}
          <Button variant="secondary" size="sm" onClick={onBrowse}>{STEAM_TEXT.browse}</Button>
        </Flex>
      )}
    </Flex>
  );
};

export { SteamDetectLine };
