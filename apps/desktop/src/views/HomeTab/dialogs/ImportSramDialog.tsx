/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { Dialog } from '@drizztdourden08/tessera/composites';
import { Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { IMPORT_CONFIRM_WORD } from '../HomeTab.constants';
import type { HomeDialogsProps } from '../HomeTab.type';

const ImportSramDialog = ({ sramImport }: HomeDialogsProps) => {
  const { dialog, confirmText, setConfirmText, confirm, close, slotCount } = sramImport;
  const typed = confirmText.trim().toLowerCase() === IMPORT_CONFIRM_WORD;

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => setConfirmText(event.target.value), [setConfirmText]);
  const handleKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter' && typed) void confirm();
  }, [typed, confirm]);

  return (
    <Dialog
      open={dialog.type === 'import-sram'}
      title="Import Save"
      message=""
      confirmLabel="Import"
      cancelLabel="Cancel"
      confirmDisabled={!typed}
      variant="danger"
      onConfirm={confirm}
      onCancel={close}
    >
      <Text as="p">
        Replace this profile&apos;s save with <Text as="strong">&quot;{dialog.targetName}&quot;</Text>? The current
        in-game save is overwritten and this cannot be undone.
      </Text>
      <Text as="p">Verified: {dialog.verified ?? 0} of {slotCount} save slot(s) pass the game&apos;s checksum.</Text>
      <Text as="p">Type <Text as="code">{IMPORT_CONFIRM_WORD}</Text> to confirm.</Text>
      <TextInput value={confirmText} onChange={handleChange} onKeyDown={handleKey} placeholder={IMPORT_CONFIRM_WORD} autoFocus />
    </Dialog>
  );
};

export { ImportSramDialog };
