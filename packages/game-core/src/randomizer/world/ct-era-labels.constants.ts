/* @layer bridge-wasm @kind constants */
import type { CtEra } from './ct-world-keys.type';

const CT_ERA_LABELS: Readonly<Record<CtEra, string>> = {
  prehistory: 'Prehistory (65,000,000 BC)',
  'middle-ages': 'Middle Ages (600 AD)',
  present: 'Present (1000 AD)',
  future: 'Future (2300 AD)',
  'end-of-time': 'End of Time',
  'dark-ages': 'Dark Ages (12,000 BC)',
  none: 'Other',
};

export { CT_ERA_LABELS };
