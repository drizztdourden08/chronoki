/* @layer renderer-components @kind component */
import { Dialog } from '@drizztdourden08/tessera/composites';
import { Box, Icon, Text } from '@drizztdourden08/tessera/primitives';
import type { HomeDialogsProps } from '../HomeTab.type';
import './HomeTabDialogs.css';

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
      <Box className="home-tab-dialogs__callout home-tab-dialogs__callout--bad">
        <Icon className="home-tab-dialogs__callout-icon" name="triangle-alert" />
        <Text as="span">{dialog.detail ?? 'That file is not a valid Chrono Trigger SRAM save.'}</Text>
      </Box>
    </Dialog>
  );
};

export { InvalidSramDialog };
