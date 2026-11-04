/* @layer renderer-components @kind hook */
import { useEffect, useState } from 'react';
import { loadProfileData } from '@app/storage/profile-data-store';
import type { ProfileData } from '@app/storage/profile-data-store';

const useProfileData = (profileId: string): ProfileData | null => {
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    let current = true;
    setData(null);
    void loadProfileData(profileId).then((loaded) => { if (current) setData(loaded); });
    return () => { current = false; };
  }, [profileId]);

  return data;
};

export { useProfileData };
