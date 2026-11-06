/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import { requireHostApi } from '@drizztdourden08/brock-react';

const useAppVersion = (): string | null => {
  const [version, setVersion] = useState<string | null>(null);
  useEffect(() => {
    void requireHostApi().getAppVersion().then(setVersion);
  }, []);
  return version;
};

export { useAppVersion };
