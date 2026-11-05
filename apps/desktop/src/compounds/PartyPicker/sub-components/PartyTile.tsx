/* @layer renderer-components @kind component */
import { Badge, Image, Pressable, Text } from '@drizztdourden08/tessera/primitives';
import { PARTY_ACTIVE_SLOTS, PARTY_CHARACTER_NAMES, PARTY_PICKER_LABELS } from '../PartyPicker.constants';
import type { PartyTileProps } from '../PartyPicker.type';

const PartyTile = ({ id, slot, disabled, spriteUrl, onToggle }: PartyTileProps) => {
  const name = PARTY_CHARACTER_NAMES[id];
  const picked = slot >= 0;
  const tone = slot < PARTY_ACTIVE_SLOTS ? 'party-tile__badge--active' : 'party-tile__badge--reserve';
  return (
    <Pressable
      className={`party-tile${picked ? ' party-tile--picked' : ''}`}
      title={name}
      disabled={disabled}
      aria-pressed={picked}
      onClick={() => onToggle(id)}
    >
      {picked && <Badge variant="inline" value={slot + 1} className={`party-tile__badge ${tone}`} />}
      {spriteUrl && <Image frame fit="contain" pixelated src={spriteUrl} alt={name} fallback="?" className="party-tile__thumb" />}
      <Text className="party-tile__label">{name}</Text>
      {id === 'magus' && <Text className="party-tile__note">{PARTY_PICKER_LABELS.experimental}</Text>}
    </Pressable>
  );
};

export { PartyTile };
