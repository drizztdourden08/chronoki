/* @layer renderer-components @kind component */
import { Dialog } from '@drizztdourden08/tessera/composites';
import { Text } from '@drizztdourden08/tessera/primitives';
import type { HomeDialogsProps } from '../HomeTab.type';

const InvalidSramDialog = ({ sramImport }: HomeDialogsProps) => {
  const { dialog, close } = sramImport;
  return (
    <Dialog
      open={dialog.type === 'import-sram-invalid'}
      title="Not a Valid Save"
      message=""
      confirmLabel="OK"
      hideCancel
      onConfirm={close}
      onCancel={close}
    >
      <Text as="p">{dialog.detail ?? 'That file is not a valid Chrono Trigger SRAM save.'}</Text>
    </Dialog>
  );
};

export { InvalidSramDialog };
