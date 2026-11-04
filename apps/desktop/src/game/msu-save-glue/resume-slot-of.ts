/* @layer bridge-wasm @kind logic */
import type { SaveSlotRef } from '@drizztdourden08/brock-port-kit';
import type { ResumeSlot } from '@drizztdourden08/brock-msu/packs';

const resumeSlotOf = (profile: string, ref: SaveSlotRef): ResumeSlot => ({
  profile,
  slotKind: ref.kind,
  slotId: ref.kind === 'quick' ? ref.slot : ref.id,
});

export { resumeSlotOf };
