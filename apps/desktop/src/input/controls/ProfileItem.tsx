/* @layer renderer-components @kind component */
import { useCallback, useState } from 'react';
import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { Icon, IconButton, TextInput } from '@drizztdourden08/tessera/primitives';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import type { ProfileItemProps } from './ProfileItem.type';

const ProfileItem = ({ profile, active, startEditing, canDelete, onSelect, onRename, onDelete }: ProfileItemProps) => {
  const [editing, setEditing] = useState(startEditing);
  const [value, setValue] = useState(profile.name);

  const commit = useCallback(() => {
    onRename(profile, value);
    setEditing(false);
  }, [onRename, profile, value]);
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []);
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') {
      e.preventDefault();
      setEditing(false);
    }
  }, [commit]);
  const beginEdit = useCallback((e?: MouseEvent) => {
    e?.stopPropagation();
    setValue(profile.name);
    setEditing(true);
  }, [profile.name]);
  const handleDelete = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    onDelete(profile);
  }, [onDelete, profile]);

  const icon = <Icon name={profile.deviceType === 'keyboard' ? 'keyboard' : 'gamepad-2'} />;

  if (editing) {
    const field = <TextInput value={value} onChange={handleChange} onBlur={commit} onKeyDown={handleKeyDown} autoFocus aria-label="Profile name" />;
    return <ListItemRow icon={icon} name={field} selected={active} />;
  }

  const actions = (
    <>
      <IconButton variant="ghost" size="xs" label="Rename profile" onClick={beginEdit}>
        <Icon name="pencil" />
      </IconButton>
      {canDelete && (
        <IconButton variant="ghost" size="xs" label="Delete profile" onClick={handleDelete}>
          <Icon name="x" />
        </IconButton>
      )}
    </>
  );

  return (
    <ListItemRow
      icon={icon}
      name={profile.name}
      meta={profile.deviceType === 'keyboard' ? 'Keyboard' : profile.assignedDevice?.displayName ?? 'Controller'}
      selected={active}
      onClick={() => onSelect(profile)}
      onDoubleClick={() => beginEdit()}
      action={actions}
      actionVisibility="hover"
      data={{ 'data-profile-id': profile.id }}
    />
  );
};

export { ProfileItem };
