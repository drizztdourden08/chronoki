/* @layer renderer-app @kind constants */
const STEAM_PROMPT_SEEN_KEY = 'chronoki.steamPromptSeen';

const STEAM_PROMPT_ROUTE = 'data/library/roms';

const STEAM_PROMPT_TEXT = {
  title: 'Steam data (optional)',
  message: 'If you own Chrono Trigger on Steam, ChronoKi can find it and build the Steam margin art. This is optional and can be done later from Data, ROMs. Nothing is read until you choose Import there.',
  open: 'Set up now',
  later: 'Later',
};

export { STEAM_PROMPT_ROUTE, STEAM_PROMPT_SEEN_KEY, STEAM_PROMPT_TEXT };
