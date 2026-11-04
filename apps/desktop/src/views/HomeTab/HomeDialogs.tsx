/* @layer renderer-components @kind component */
import { ImportSramDialog } from './dialogs/ImportSramDialog';
import { InvalidSramDialog } from './dialogs/InvalidSramDialog';
import { UnverifiedSramDialog } from './dialogs/UnverifiedSramDialog';
import type { HomeDialogsProps } from './HomeTab.type';

const HomeDialogs = ({ sramImport }: HomeDialogsProps) => (
  <>
    <ImportSramDialog sramImport={sramImport} />
    <InvalidSramDialog sramImport={sramImport} />
    <UnverifiedSramDialog sramImport={sramImport} />
  </>
);

export { HomeDialogs };
