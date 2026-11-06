/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = { title: 'Contributing', icon: 'braces', order: 1, keywords: ['developer', 'debug', 'logs', 'contributor', 'report'] };

const sections: Section[] = [
  {
    id: 'developer-instrumentation',
    title: 'Instrumentation',
    items: [
      {
        key: 'developerToolsEnabled',
        label: 'Developer Mode',
        description: 'Turns on developer tools.',
        keywords: 'developer mode devtools instrumentation',
      },
      {
        key: 'experimentalFeaturesEnabled',
        label: 'Experimental Features',
        description: 'Enables unfinished features: Archipelago online play.',
        hint: 'Needs Developer Mode.',
        keywords: 'experimental unfinished archipelago online',
      },
    ],
  },
  {
    id: 'developer-debug-reporting',
    title: 'Debug Reporting',
    items: [
      {
        key: 'allowDebugLogging',
        label: 'Allow debugging logs tracking',
        description: 'Keeps detailed logs and adds a capture key (`) and a floating button for sending a debug report.',
        keywords: 'debug logs tracking report crash capture',
      },
    ],
  },
];

export default sections;
export { meta };
