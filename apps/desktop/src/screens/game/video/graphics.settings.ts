/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';
import { gateItem } from '@app/settings-controls/gate-items';

const meta: ScreenMeta = { title: 'Graphics', icon: 'palette', order: 2, keywords: ['graphics', 'rendering', 'resolution', 'render scale', 'filtering', 'quality'] };

const sections: Section[] = [
  {
    id: 'rendering',
    title: 'Rendering',
    subsections: [
      {
        id: 'rendering-engine',
        title: 'Engine',
        items: [
          gateItem('renderScale'),
          {
            key: 'renderScale',
            label: 'Render Scale',
            description: 'How many times the SNES size the picture is drawn at, from 2x to 4x.',
            hint: 'Needs Internal Resolution.',
            keywords: 'render scale resolution internal sharp 2x 4x',
          },
        ],
      },
      {
        id: 'rendering-quality',
        title: 'Quality',
        items: [gateItem('linearFiltering')],
      },
    ],
  },
];

export default sections;
export { meta };
