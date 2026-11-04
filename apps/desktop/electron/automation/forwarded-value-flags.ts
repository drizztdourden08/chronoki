/* @layer electron-main @kind logic */
import { FORWARDED_BOOLEAN_FLAGS, FORWARDED_VALUE_FLAGS } from './automation-flags.constants';
import { chronokiAutomationFlags } from './chronoki-automation-flags';

const forwardedValueFlags = (argv: readonly string[]): string[] => [
  ...FORWARDED_VALUE_FLAGS.flatMap((name) => {
    const value = chronokiAutomationFlags.flagValue(`--${name}`, argv);
    return value ? [`--startup-${name}=${value}`] : [];
  }),
  ...FORWARDED_BOOLEAN_FLAGS.filter((name) => argv.includes(`--${name}`)).map((name) => `--startup-${name}`),
];

export { forwardedValueFlags };
