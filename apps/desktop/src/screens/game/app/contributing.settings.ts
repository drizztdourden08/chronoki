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
        label: 'Developer tools',
        description: 'Allow opening the developer tools.',
        hint: 'On, the menu shows the developer entries and the shortcut opens the browser developer tools.',
        keywords: 'developer mode devtools instrumentation',
      },
    ],
  },
  {
    id: 'developer-debug-reporting',
    title: 'Debug Reporting',
    items: [
      {
        key: 'allowDebugLogging',
        label: 'Debug logging',
        description: 'Write debug lines to the session log.',
        hint: 'On, the session log keeps the detailed lines that help when you report a bug. The log grows faster.',
        keywords: 'debug logs tracking report crash capture',
      },
    ],
  },
];

export default sections;
export { meta };
