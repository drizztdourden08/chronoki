/* @layer renderer-components @kind component */
import { ImportSramDialog } from './dialogs/ImportSramDialog';
import { InvalidSramDialog } from './dialogs/InvalidSramDialog';
import type { HomeDialogsProps } from './HomeTab.type';

const HomeDialogs = ({ sramImport }: HomeDialogsProps) => (
  <>
    <ImportSramDialog sramImport={sramImport} />
    <InvalidSramDialog sramImport={sramImport} />
  </>
);

export { HomeDialogs };
