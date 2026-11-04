/* @layer renderer-components @kind component */
import { Button, DropZone, Field, Flex, Text } from '@drizztdourden08/tessera/primitives';
import { STEAM_ACCEPT, STEAM_TEXT } from '../Roms.constants';
import { useSteamDetect } from '../behavior/useSteamDetect';
import { useSteamImport } from '../behavior/useSteamImport';
import { SteamDetectLine } from './SteamDetectLine';
import { SteamStatus } from './SteamStatus';

const SteamImport = () => {
  const { marker, busy, status, handleDrop, handleImportPick, handleBrowse, handleRemove } = useSteamImport();
  const detect = useSteamDetect(marker === null);
  const { path, size } = detect.status;
  return (
    <>
      <Field hint={`${STEAM_TEXT.hint} ${STEAM_TEXT.unlocks}`} width="full">
        {marker ? (
          <SteamStatus marker={marker} busy={busy} onRemove={handleRemove} />
        ) : (
          <>
            {detect.available && (
              <SteamDetectLine
                status={detect.status}
                busy={busy}
                onImport={() => path && void handleImportPick({ path, size: size ?? 0 })}
                onCancel={() => void detect.cancel()}
                onRescan={() => void detect.scan()}
              />
            )}
            {!busy && detect.available && (
              <Flex direction="row">
                <Button variant="secondary" size="sm" onClick={() => void handleBrowse()}>{STEAM_TEXT.browse}</Button>
              </Flex>
            )}
            {!busy && <DropZone accept={STEAM_ACCEPT} label={STEAM_TEXT.dropLabel} hint={STEAM_TEXT.dropHint} onDrop={handleDrop} />}
          </>
        )}
      </Field>
      {status && <Text variant="body">{status.message}</Text>}
    </>
  );
};

export { SteamImport };
