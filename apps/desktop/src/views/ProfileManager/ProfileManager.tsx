/* @layer renderer-components @kind component */
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import { ListDetailLayout } from '@drizztdourden08/tessera/composites';
import { PROFILE_TEXT } from './ProfileManager.constants';
import type { ProfileManagerProps } from './ProfileManager.type';
import { useProfileManager } from './behavior/useProfileManager';
import { ProfileCreateWizard } from './sub-components/ProfileCreateWizard/ProfileCreateWizard';
import { ProfileDetailPanel } from './sub-components/ProfileDetailPanel';
import { ProfileListPane } from './sub-components/ProfileListPane';

const ProfileManager = ({ onOpenProfile }: ProfileManagerProps) => {
  const manager = useProfileManager();
  const { profiles, readyRoms, selectedProfile, creating, listCollapsed } = manager;

  const list = (
    <ProfileListPane
      profiles={profiles}
      selected={selectedProfile?.id ?? null}
      creating={creating}
      canCreate={readyRoms.length > 0}
      onSelect={manager.select}
      onOpen={onOpenProfile}
      onDelete={manager.remove}
      onCreate={manager.startCreating}
    />
  );

  const detail = creating ? (
    <ProfileCreateWizard readyRoms={readyRoms} onCancel={manager.stopCreating} onCreated={manager.finishCreating} />
  ) : selectedProfile && (
    <ProfileDetailPanel
      key={selectedProfile.id}
      profile={selectedProfile}
      readyRoms={readyRoms}
      onOpen={onOpenProfile}
      onDelete={manager.remove}
    />
  );

  return (
    <ListDetailLayout
      listShowTitle={false}
      listContainers={[{ title: PROFILE_TEXT.listTitle, content: list }]}
      listLabel={PROFILE_TEXT.listLabel}
      collapsed={listCollapsed}
      onCollapsedChange={manager.setListCollapsed}
      detailScroll={!creating}
      detail={detail}
      emptyDetail={<EmptyState message={PROFILE_TEXT.emptyDetail} />}
    />
  );
};

export { ProfileManager };
