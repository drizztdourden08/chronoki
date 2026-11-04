/* @layer renderer-app @kind component */
import { useProfiles } from '@drizztdourden08/brock-react';
import type { PageProps, ScreenMeta, SearchEntrySeed } from '@drizztdourden08/brock-react';
import { ControlsSettings } from '@app/input/controls/ControlsSettings';

const meta: ScreenMeta = { title: 'Controls', icon: 'keyboard', showHeader: true, order: 4, fill: true, keywords: ['controls', 'bindings', 'keys', 'gamepad', 'controller', 'buttons'] };

const searchEntries: SearchEntrySeed[] = [
  { label: 'Input profiles', keywords: ['input profile', 'bindings set', 'rename', 'new profile'], anchor: 'input-profiles', description: 'Sets of bindings you can switch between' },
  { label: 'Game controls', keywords: ['bindings', 'buttons', 'keys', 'remap'], anchor: 'bindings', description: 'The SNES buttons on your keyboard or pad' },
  { label: 'Shortcuts and functions', keywords: ['shortcut', 'hotkey', 'save state', 'fast forward', 'screenshot'], anchor: 'bindings', description: 'App shortcuts such as save state and fast forward' },
  { label: 'Controllers', keywords: ['gamepad', 'device', 'controller', 'preset'], anchor: 'devices', description: 'Connected controllers and their presets' },
];

const ControlsPage = (props: PageProps) => {
  const { active } = useProfiles();
  const profileId = active?.id ?? props.profile?.id ?? '';
  return <ControlsSettings profileId={profileId} />;
};

export default ControlsPage;
export { meta, searchEntries };
