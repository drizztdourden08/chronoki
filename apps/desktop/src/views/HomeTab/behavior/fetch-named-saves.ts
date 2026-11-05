/* @layer renderer-components @kind logic */
import type { NamedSaveKind } from '@drizztdourden08/brock-port-kit';
import { platformSaveStore } from '@app/game/save-states';
import type { NamedSavesData } from '../HomeTab.type';
import { dataUrlOf } from '@app/game/save-slots';

const fetchNamedSaves = async (profileId: string, kind: NamedSaveKind): Promise<NamedSavesData | null> => {
  try {
    const { named, slots } = platformSaveStore();
    const list = (await named.list(profileId, kind)).slice().sort((a, b) => b.savedAt - a.savedAt);
    const screenshots: Record<string, string> = {};
    for (const entry of list) {
      if (!entry.hasScreenshot) continue;
      const url = dataUrlOf(await slots.readScreenshot(profileId, { kind, id: entry.id }));
      if (url) screenshots[entry.id] = url;
    }
    return { list, screenshots };
  } catch {
    return null;
  }
};

export { fetchNamedSaves };
