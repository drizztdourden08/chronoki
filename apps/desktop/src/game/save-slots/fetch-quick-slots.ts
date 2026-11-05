/* @layer bridge-wasm @kind logic */
import { platformSaveStore } from '@app/game/save-states';
import type { SlotInfo } from './save-slots.type';
import { dataUrlOf } from './data-url-of';
import { emptySlots } from './empty-slots';

const fetchQuickSlots = async (profileId: string): Promise<SlotInfo[] | null> => {
  try {
    const { slots } = platformSaveStore();
    const infos = await slots.listQuick(profileId);
    return await Promise.all(emptySlots().map(async ({ slot }) => {
      const info = infos.find((candidate) => candidate.slot === slot);
      const png = info?.hasScreenshot ? await slots.readScreenshot(profileId, { kind: 'quick', slot }) : null;
      return { slot, savedAt: info?.savedAt ?? null, screenshot: dataUrlOf(png) };
    }));
  } catch {
    return null;
  }
};

export { fetchQuickSlots };
