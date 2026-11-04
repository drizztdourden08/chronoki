/* @layer renderer-components @kind component */
import { Field, Grid, SegmentedControl, Select, Stack, Text, TextInput } from '@drizztdourden08/tessera/primitives';
import { WizardReview } from '@drizztdourden08/tessera/composites';
import type { WizardApi } from '@drizztdourden08/tessera/composites';
import { PRESET_HINTS, PRESET_OPTIONS } from '@app/profiles/presets';
import type { ProfileWizardValues, ReadyRom } from '../../ProfileManager.type';
import { STEP_IDS, STEP_LABELS } from './ProfileCreateWizard.constants';
import { ModuleStepBody } from './ModuleStepBody';
import { presetLabelOf } from './behavior/preset-label-of';
import { randomizerReviewSection } from './behavior/randomizer-review-section';

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
          <Stack gap="md">
            <SegmentedControl label="Preset" value={values.preset} options={PRESET_OPTIONS} onChange={(preset) => update({ preset })} />
            <Text variant="body">{PRESET_HINTS[values.preset]}</Text>
          </Stack>
        </Grid>
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
              { label: 'Preset', value: presetLabelOf(values.preset) },
            ],
          }, ...[randomizerReviewSection(values)].filter((section) => section !== null)]}
          disabled={wizard.busy}
          onEdit={(stepId) => wizard.goTo(stepId)}
        />
      );
    default:
      return <ModuleStepBody wizard={wizard} />;
  }
};

export { ProfileStepBody };
