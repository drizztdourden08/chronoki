/* @layer renderer-components @kind component */
import { useCallback, useRef } from 'react';
import { Box, Button, FileInput, Icon, ProgressBar, Text } from '@drizztdourden08/tessera/primitives';
import { PACK_IMPORT_TEXT } from '../ProfileManager.constants';
import type { MsuFolderImport } from '../ProfileManager.type';

const MsuFolderImportControl = ({ busy, percent, error, importFiles }: MsuFolderImport)=> {
  const input = useRef<HTMLInputElement | null>(null);
  const bindFolderMode = useCallback((element: HTMLInputElement | null) => {
    input.current = element;
    element?.setAttribute('webkitdirectory', '');
  }, []);

  return (
    <Box>
      <FileInput ref={bindFolderMode} multiple disabled={busy} onFiles={(files) => void importFiles(files)} />
      <Button
        variant="secondary"
        size="sm"
        icon={<Icon name="folder-open" />}
        loading={busy}
        title={PACK_IMPORT_TEXT.title}
        onClick={() => input.current?.click()}
      >
        {PACK_IMPORT_TEXT.button}
      </Button>
      {busy && percent !== null && <ProgressBar value={percent} label={PACK_IMPORT_TEXT.progress} />}
      {error !== null && <Text variant="caption" tone="danger" role="alert">{error}</Text>}
    </Box>
  );
};

export { MsuFolderImportControl };
