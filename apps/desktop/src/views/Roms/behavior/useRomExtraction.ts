/* @layer renderer-components @kind hook */
import { useState } from 'react';
import { useImportProgress } from '@app/hooks/useImportProgress';

const useRomExtraction = () => {
  const [withSprites, setWithSprites] = useState(true);
  const [spriteError, setSpriteError] = useState<string | null>(null);
  const spriteProgress = useImportProgress('sprites');

  return { withSprites, setWithSprites, spriteError, setSpriteError, spriteProgress };
};

export { useRomExtraction };
