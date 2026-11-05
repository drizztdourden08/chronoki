/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';
import { CONFIG_MODE_OPTIONS, PACK_FORMAT_OPTIONS } from '@app/settings-controls/audio/audio-options.constants';

const meta: ScreenMeta = {
  title: 'Audio',
  icon: 'volume-2',
  order: 2,
  keywords: ['audio', 'sound', 'volume', 'mute', 'music', 'uploads', 'instant'],
};

const sections: Section[] = [
  {
    id: 'volume',
    title: 'Volume',
    items: [
      {
        key: 'masterVolume',
        label: 'Master Volume',
        description: 'Controls the overall game volume, so it affects all audio output',
      },
      gateItem('perGroupVolume'),
      { key: 'musicVolume', label: 'Music Volume', description: 'Sets the music level, for the original soundtrack and any music pack', hint: 'Needs Independent Music / SFX.', keywords: 'volume music bgm pack' },
      { key: 'sfxVolume', label: 'SFX Volume', description: 'Sets the sound-effects level', hint: 'Needs Independent Music / SFX.', keywords: 'volume sfx sound effects' },
    ],
  },
  {
    id: 'music-packs',
    title: 'Music Packs',
    subsections: [
      {
        id: 'pack-choice',
        title: 'Pack',
        items: [
          { key: 'detectedPack', label: 'Pack', description: 'The pack assigned to this profile. Change it in Profiles.', keywords: 'pack detected music profile' },
          { key: 'msuConfigMode', label: 'Configuration', description: 'Auto matches the assigned pack. Manual lets you set the format.', keywords: 'auto manual config pack', control: { kind: 'choice', options: CONFIG_MODE_OPTIONS } },
          { key: 'enableMSU', label: 'Pack Format', description: 'MSU-1, OPUZ or Layered. Auto reads it from the pack.', keywords: 'msu pack format opuz layered', control: { kind: 'choice', options: PACK_FORMAT_OPTIONS } },
        ],
      },
      {
        id: 'replacement-music',
        title: 'Replacement music',
        items: [
          { key: 'resumeMSU', label: 'Resume Tracks', description: 'Returning to an area picks its music up where it left off instead of restarting.', keywords: 'resume position continue' },
          { key: 'resetMSUAtTitle', label: 'Reset At Title Screen', description: 'Reaching the title screen forgets every remembered position, so a new run starts with fresh music.', keywords: 'reset title restart fresh' },
          { key: 'msuChipFallback', label: 'Original Music For Missing Tracks', description: 'Songs the pack lacks play as in the game.', keywords: 'fallback chip original missing tracks' },
        ],
      },
      {
        id: 'replacement-sounds',
        title: 'Replacement sounds',
        items: [
          { key: 'packReplaceSfx', label: 'Replace Sound Effects', description: 'Lets a pack take over the one-shot effects.', keywords: 'sfx effects pack replace sound' },
        ],
      },
    ],
  },
  { id: 'sound', title: 'Sound', items: [gateItem('instantUploads')] },
  {
    id: 'playback',
    title: 'Audio Device',
    items: [
      {
        key: 'audioFreq',
        label: 'Sample Rate',
        description: 'Output rate: 44100 Hz or 48000 Hz. Auto keeps the current rate.',
        hint: 'Applies when the next game starts.',
        keywords: 'frequency sample rate hz automatic output 44100 48000',
      },
      {
        key: 'audioChannels',
        label: 'Channels',
        description: 'Mono or stereo output.',
        hint: 'Auto keeps stereo. Applies when the next game starts.',
        keywords: 'mono stereo channel automatic output',
      },
      {
        key: 'audioSamples',
        label: 'Buffer Size',
        description: 'Latency against stability.',
        hint: 'Smaller buffers may crackle.',
        keywords: 'buffer latency crackle automatic output',
      },
    ],
  },
];

export default sections;
export { meta };
