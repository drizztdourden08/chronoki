/* @layer renderer-components @kind component */
import { Button, Icon } from '@drizztdourden08/tessera/primitives';
import type { HeroToolsProps } from '../ProfileHero.type';

const IMPORT_HINT = 'Import a raw SRAM save (.srm) from another emulator';
const IMPORT_STOPPED_HINT = 'Stop the game to import a save';

const HeroTools = ({ canRevealFolder, importDisabled = false, onOpenFolder, onImportSram }: HeroToolsProps) => (
  <>
    {canRevealFolder && (
      <Button variant="secondary" size="sm" icon={<Icon name="folder-open" />} onClick={onOpenFolder} title="Open this profile's folder">
        Folder
      </Button>
    )}
    <Button
      variant="secondary"
      size="sm"
      icon={<Icon name="download" />}
      onClick={onImportSram}
      disabled={importDisabled}
      title={importDisabled ? IMPORT_STOPPED_HINT : IMPORT_HINT}
    >
      Import
    </Button>
  </>
);

export { HeroTools };
