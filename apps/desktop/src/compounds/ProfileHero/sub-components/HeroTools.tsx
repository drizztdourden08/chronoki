/* @layer renderer-components @kind component */
import { Button, Icon } from '@drizztdourden08/tessera/primitives';
import type { HeroToolsProps } from '../ProfileHero.type';
import { IMPORT_HINT, IMPORT_STOPPED_HINT } from '../ProfileHero.constants';


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
