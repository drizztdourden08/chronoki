/* @layer renderer-components @kind logic */
import { platformSaveStore } from '@app/game/save-states';
import { QUICK_SAVE_SLOTS } from '../HomeTab.constants';
import type { SlotInfo } from '../HomeTab.type';
import { dataUrlOf } from './data-url-of';

const emptySlots = (): SlotInfo[] => Array.from({ length: QUICK_SAVE_SLOTS }, (_, slot) => ({ slot, savedAt: null, screenshot: null }));

const fetchQuickSlots = async (profileId: string): Promise<SlotInfo[] | null> => {
  try {
    const { slots } = platformSaveStore();
    const infos = await slots.listQuick(profileId);
    return Promise.all(emptySlots().map(async ({ slot }) => {
      const info = infos.find((candidate) => candidate.slot === slot);
      const png = info?.hasScreenshot ? await slots.readScreenshot(profileId, { kind: 'quick', slot }) : null;
      return { slot, savedAt: info?.savedAt ?? null, screenshot: dataUrlOf(png) };
    }));
  } catch {
    return null;
  }
};

export { emptySlots, fetchQuickSlots };
