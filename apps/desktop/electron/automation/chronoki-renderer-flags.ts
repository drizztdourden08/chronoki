/* @layer electron-main @kind logic */
import { GAME_LAUNCH_FLAGS, SCREENSHOT_FLAG } from './automation-flags.constants';
import { chronokiAutomationFlags } from './chronoki-automation-flags';
import { forwardedValueFlags } from './forwarded-value-flags';

const screenshotKindOf = (argv: readonly string[]): 'game' | 'hub' | null => {
  if (chronokiAutomationFlags.flagValue(SCREENSHOT_FLAG, argv) === null) return null;
  return GAME_LAUNCH_FLAGS.some((flag) => chronokiAutomationFlags.hasFlag(flag, argv)) ? 'game' : 'hub';
};

const chronokiRendererFlags = (argv: string[]): string[] => {
  const flags: string[] = [];
  if (chronokiAutomationFlags.isHeadlessLaunch(argv) && !argv.includes('--sound')) flags.push('--startup-muted');
  flags.push(...forwardedValueFlags(argv));
  const screenshot = screenshotKindOf(argv);
  if (screenshot) flags.push(`--startup-screenshot=${screenshot}`);
  return flags;
};

export { chronokiRendererFlags };
