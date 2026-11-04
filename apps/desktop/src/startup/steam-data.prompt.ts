/* @layer renderer-app @kind logic */
import { defineStartupPrompt } from '@drizztdourden08/brock-react';
import { hasSteamData } from '@app/storage/steam-store/has-steam-data';
import { STEAM_PROMPT_ROUTE, STEAM_PROMPT_SEEN_KEY, STEAM_PROMPT_TEXT } from './steam-data.prompt.constants';

const wasSeen = (): boolean => {
  try {
    return localStorage.getItem(STEAM_PROMPT_SEEN_KEY) === '1';
  } catch {
    return true;
  }
};

const markSeen = (): boolean => {
  try {
    localStorage.setItem(STEAM_PROMPT_SEEN_KEY, '1');
    return true;
  } catch {
    return false;
  }
};

export default defineStartupPrompt({
  order: 90,
  run: async ({ confirmAction, nav }) => {
    if (wasSeen() || (await hasSteamData())) return;
    if (!markSeen()) return;
    const open = await confirmAction({ title: STEAM_PROMPT_TEXT.title, message: STEAM_PROMPT_TEXT.message, confirmLabel: STEAM_PROMPT_TEXT.open, cancelLabel: STEAM_PROMPT_TEXT.later });
    if (open) nav.open(STEAM_PROMPT_ROUTE);
  },
});
