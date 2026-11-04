/* @layer renderer-components @kind component */
import { Field, Grid, SegmentedControl, Select, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { WizardReview } from '@drizztdourden08/tessera/composites';
import type { WizardApi } from '@drizztdourden08/tessera/composites';
import { MODE_LABELS, MODE_OPTIONS } from '../../ProfileManager.constants';
import type { ProfileWizardValues, ReadyRom } from '../../ProfileManager.type';
import { MODE_HINTS, STEP_IDS, STEP_LABELS } from './ProfileCreateWizard.constants';

const ProfileStepBody = ({ wizard, readyRoms }: { wizard: WizardApi<ProfileWizardValues>; readyRoms: ReadyRom[] }) => {
  const { values, update } = wizard;

  switch (wizard.current.id) {
    case STEP_IDS.profile:
      return (
        <Grid columns={2} gap="md">
          <Field label="Profile Name">
            <TextInput type="text" placeholder="My Profile" value={values.name} onChange={(event) => update({ name: event.target.value })} />
          </Field>
          <Field label="ROM">
            <Select
              value={values.rom}
              onChange={(rom) => update({ rom })}
              options={readyRoms.map((rom) => ({ value: rom.romFile, label: rom.romFile }))}
              placeholder="Select ROM..."
            />
          </Field>
        </Grid>
      );
    case STEP_IDS.mode:
      return (
        <Stack gap="md">
          <SegmentedControl label="Mode" value={values.mode} options={MODE_OPTIONS} onChange={(mode) => update({ mode })} />
          <Text variant="body">{MODE_HINTS[values.mode]}</Text>
        </Stack>
      );
    case STEP_IDS.review:
      return (
        <WizardReview
          sections={[{
            stepId: STEP_IDS.profile,
            title: STEP_LABELS.profile,
            rows: [
              { label: 'Profile Name', value: values.name.trim() },
              { label: 'ROM', value: values.rom, title: values.rom },
              { label: 'Mode', value: MODE_LABELS[values.mode] },
            ],
          }]}
          disabled={wizard.busy}
          onEdit={(stepId) => wizard.goTo(stepId)}
        />
      );
    default:
      return null;
  }
};

export { ProfileStepBody };
