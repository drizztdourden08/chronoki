/* @layer renderer-app @kind types */
type ProfileModeId = 'vanilla-safe' | 'vanilla' | 'randomizer' | 'randomizer-online' | 'randomizer-archipelia';

type ModeSource = { randomizer?: { mode: 'local' | 'online' | 'archipelia' } } | null | undefined;

export type { ModeSource, ProfileModeId };
