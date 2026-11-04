/* @layer renderer-components @kind component */
import { useMemo } from 'react';
import type { FocusEvent } from 'react';
import { InlineCreateForm } from '@drizztdourden08/tessera/composites';
import { Box } from '@drizztdourden08/tessera/primitives';
import { defaultSaveName } from '../behavior/default-save-name';
import type { CreateSaveFormProps } from '../HomeTab.type';

const selectTyped = (event: FocusEvent<HTMLElement>) => {
  if (event.target instanceof HTMLInputElement) event.target.select();
};

const CreateSaveForm = ({ onCreate, onCancel }: CreateSaveFormProps) => {
  const name = useMemo(defaultSaveName, []);
  return (
    <Box onFocus={selectTyped}>
      <InlineCreateForm compact size="sm" defaultValue={name} label="Save name" submitLabel="Save" onCreate={onCreate} onCancel={onCancel} />
    </Box>
  );
};

export { CreateSaveForm };
