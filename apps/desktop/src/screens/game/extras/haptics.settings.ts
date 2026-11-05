/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = { title: 'Haptics', icon: 'vibrate', order: 1, keywords: ['haptics', 'rumble', 'vibration', 'controller'] };

const asPercent = (value: number): string => `${value}%`;

const sections: Section[] = [
  {
    id: 'haptics-general',
    title: 'Vibration',
    items: [
      { key: 'haptics.enabled', label: 'Enable Haptic Feedback', description: 'Enable controller vibration/rumble for game events. Requires a compatible controller (Xbox, Switch Pro, DualSense).', keywords: 'vibration rumble haptic feedback controller' },
      {
        key: 'haptics.intensity',
        label: 'Vibration Intensity',
        description: 'Global intensity multiplier for all haptic feedback',
        keywords: 'vibration intensity strength level',
        control: { kind: 'range', min: 10, max: 100, step: 5, format: asPercent },
      },
    ],
  },
  {
    id: 'haptics-combat',
    title: 'Combat',
    items: [
      { key: 'haptics.damageTaken', label: 'Damage Taken', description: 'Vibration scaled to damage amount when the party gets hurt in battle (stronger for more damage)', keywords: 'damage hurt health hp battle' },
      { key: 'haptics.enemyDefeated', label: 'Enemy Defeated', description: 'Normal vibration when an enemy falls in battle', keywords: 'enemy defeated kill battle win' },
    ],
  },
];

export default sections;
export { meta };
