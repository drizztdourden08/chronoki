/* @layer renderer-components @kind component */
import { Button, Flex, Icon, Stack, Status, Text, Title } from '@drizztdourden08/tessera/primitives';
import { MODE_BADGE_LABELS } from '@app/compounds/ModeBadge';
import { PROFILE_TEXT } from '../ProfileManager.constants';
import type { ProfileDetailHeaderProps } from '../ProfileManager.type';
import { ProfileFolderButton } from './ProfileFolderButton';

const ProfileDetailHeader = (props: ProfileDetailHeaderProps) => {
  const { profile, mode, onOpen, onDelete } = props;

  return (
    <Flex className="profile-detail__header" justify="between" align="start" gap="md" wrap>
      <Stack gap="2xs" className="profile-detail__heading">
        <Flex gap="sm" align="center" wrap>
          <Title level={3}>{profile.name}</Title>
          <Status tone="primary" variant="pill">{MODE_BADGE_LABELS[mode]}</Status>
        </Flex>
        <Text variant="caption" tone="muted">{profile.romFile}</Text>
      </Stack>
      <Flex gap="sm" align="center" wrap>
        <Button variant="primary" icon={<Icon name="play" />} onClick={onOpen}>{PROFILE_TEXT.open}</Button>
        <ProfileFolderButton profileId={profile.id} />
        <Button variant="danger" icon={<Icon name="trash-2" />} onClick={onDelete}>{PROFILE_TEXT.delete}</Button>
      </Flex>
    </Flex>
  );
};

export { ProfileDetailHeader };
