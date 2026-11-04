/* @layer renderer-components @kind component */
import { Dialog } from '@drizztdourden08/tessera/composites';
import { Text } from '@drizztdourden08/tessera/primitives';
import type { HomeDialogsProps } from '../HomeTab.type';

const UnverifiedSramDialog = ({ sramImport }: HomeDialogsProps) => {
  const { dialog, close, acceptUnverified, slotCount } = sramImport;
  return (
    <Dialog
      open={dialog.type === 'import-sram-unverified'}
      title="Checksum Mismatch"
      message=""
      confirmLabel="Import anyway"
      cancelLabel="Cancel"
      variant="danger"
      onConfirm={acceptUnverified}
      onCancel={close}
    >
      <Text as="p">
        Verified: 0 of {slotCount} save slot(s) pass the game&apos;s checksum. The game will treat every slot in{' '}
        <Text as="strong">&quot;{dialog.targetName}&quot;</Text> as empty. Import it anyway?
      </Text>
    </Dialog>
  );
};

export { UnverifiedSramDialog };
