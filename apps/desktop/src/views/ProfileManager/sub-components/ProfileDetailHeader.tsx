/* @layer renderer-components @kind component */
import { Button, Flex, Icon, Stack, Status, Text, Title } from '@drizztdourden08/tessera/primitives';
import { PROFILE_TEXT } from '../ProfileManager.constants';
import type { ProfileDetailHeaderProps } from '../ProfileManager.type';
import { ProfileFolderButton } from './ProfileFolderButton';

const ProfileDetailHeader = (props: ProfileDetailHeaderProps) => {
  const { profile, modeLabel, onOpen, onDelete } = props;

  return (
    <Flex justify="between" align="start" gap="md" wrap>
      <Stack gap="2xs">
        <Flex gap="sm" align="center" wrap>
          <Title level={3}>{profile.name}</Title>
          <Status tone="primary" variant="pill">{modeLabel}</Status>
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
