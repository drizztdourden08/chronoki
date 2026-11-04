/* @layer renderer-app @kind logic */
import type { Section } from '@drizztdourden08/brock-react';
import { FEATURE_REGISTRY } from '@chronoki/features';
import { GATE_GROUP_ORDER } from './gate-sections.constants';
import { GATE_KEY_PREFIX } from './gate-keys.constants';

const gateSections = (): Section[] =>
  GATE_GROUP_ORDER.flatMap((group) => {
    const items = FEATURE_REGISTRY.filter((feature) => feature.group === group).map((feature) => ({
      key: `${GATE_KEY_PREFIX}${feature.id}`,
      label: feature.label,
      description: feature.description,
      hint: feature.userMessage,
    }));
    return items.length === 0 ? [] : [{ id: `gates-${group}`, title: group, items }];
  });

export { gateSections };
