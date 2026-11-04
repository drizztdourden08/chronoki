/* @layer renderer-components @kind component */
import { Field, Select, Toggle } from '@drizztdourden08/tessera/primitives';
import type { CtOptionFieldProps } from '../../CtOptionsStepBody.type';
import { FROZEN_HINT } from '../../CtOptionsStepBody.constants';
import { choiceLabelOf } from './choice-label-of';

const CtOptionField = ({ option, value, onChange }: CtOptionFieldProps) => {
  const description = option.frozen ? FROZEN_HINT : undefined;
  if (typeof option.default === 'boolean') {
    return <Toggle label={option.label} description={description} checked={value === true} disabled={option.frozen} onChange={onChange} />;
  }
  const choices = (option.choices ?? [option.default]).map((choice) => ({ value: String(choice), label: choiceLabelOf(choice) }));
  return (
    <Field label={option.label} hint={description}>
      <Select value={String(value)} options={choices} disabled={option.frozen} onChange={onChange} />
    </Field>
  );
};

export { CtOptionField };
