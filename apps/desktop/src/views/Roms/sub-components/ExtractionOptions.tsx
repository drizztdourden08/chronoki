/* @layer renderer-components @kind component */
import { Callout, Checkbox } from '@drizztdourden08/tessera/primitives';
import { ROMS_TEXT } from '../Roms.constants';
import { ImportProgress } from './ImportProgress';
import type { ExtractionOptionsProps } from './ExtractionOptions.type';

const ExtractionOptions = ({ extraction }: ExtractionOptionsProps) => {
  const { withSprites, setWithSprites, spriteProgress, spriteError } = extraction;

  return (
    <>
      <Checkbox checked={withSprites} onChange={setWithSprites} label={ROMS_TEXT.spritesToo} />
      {spriteProgress.active && <ImportProgress state={spriteProgress} fallbackLabel={ROMS_TEXT.spritesRunning} />}
      {spriteError && <Callout tone="danger">{spriteError}</Callout>}
    </>
  );
};

export { ExtractionOptions };
