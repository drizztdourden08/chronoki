/* @layer renderer-components @kind component */
import { Field, Grid, SegmentedControl, Select, TextInput } from '@drizztdourden08/tessera/primitives';
import { randomizerReviewSections } from '@drizztdourden08/brock-randomizer/renderer';
import { WizardReview } from '@drizztdourden08/tessera/composites';
import type { ProfileStepBodyProps } from './ProfileStepBody.type';
import { PRESET_OPTIONS } from '@app/profiles/presets';
import { NO_PACK_LABEL } from '../../ProfileManager.constants';
import { useMsuPacks } from '../../behavior/useMsuPacks';
import { STEP_IDS, STEP_LABELS } from './ProfileCreateWizard.constants';
import { ModuleStepBody } from './ModuleStepBody';
import { presetLabelOf } from './behavior/preset-label-of';

const ProfileStepBody = ({ wizard, readyRoms, subStep, onSubStepChange }: ProfileStepBodyProps) => {
  const { values, update } = wizard;
  const { packs } = useMsuPacks();

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
          <SegmentedControl label="Preset" value={values.preset} options={PRESET_OPTIONS} onChange={(preset) => update({ preset })} />
          <Field label="MSU Pack">
            <Select
              value={values.msuPack}
              onChange={(msuPack) => update({ msuPack })}
              options={[{ value: '', label: NO_PACK_LABEL }, ...packs.map((name) => ({ value: name, label: name }))]}
              placeholder={NO_PACK_LABEL}
            />
          </Field>
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
              { label: 'MSU Pack', value: values.msuPack || NO_PACK_LABEL },
            ],
          }, ...randomizerReviewSections(values)]}
          disabled={wizard.busy}
          onEdit={(stepId) => wizard.goTo(stepId)}
        />
      );
    default:
      return <ModuleStepBody wizard={wizard} subStep={subStep} onSubStepChange={onSubStepChange} />;
  }
};

export { ProfileStepBody };
