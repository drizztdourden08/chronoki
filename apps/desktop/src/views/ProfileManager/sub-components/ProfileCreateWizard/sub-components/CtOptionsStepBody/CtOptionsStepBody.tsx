/* @layer renderer-components @kind component */
import { Card, Stack } from '@drizztdourden08/tessera/primitives';
import { CT_OPTION_CATALOG } from '@chronoki/game-core';
import { CT_OPTION_SECTIONS } from './CtOptionsStepBody.constants';
import type { CtOptionsStepBodyProps } from './CtOptionsStepBody.type';
import { CtOptionField } from './sub-components/CtOptionField';

const CtOptionsStepBody = ({ value, onChange }: CtOptionsStepBodyProps) => (
  <Stack gap="md">
    {CT_OPTION_SECTIONS.map((section) => (
      <Card key={section.id} title={section.title}>
        <Stack gap="sm">
          {CT_OPTION_CATALOG.filter((option) => section.keys.includes(option.key)).map((option) => (
            <CtOptionField
              key={option.key}
              option={option}
              value={value.overrides[option.key] ?? option.default}
              onChange={(next) => onChange({ overrides: { ...value.overrides, [option.key]: next } })}
            />
          ))}
        </Stack>
      </Card>
    ))}
  </Stack>
);

export { CtOptionsStepBody };
