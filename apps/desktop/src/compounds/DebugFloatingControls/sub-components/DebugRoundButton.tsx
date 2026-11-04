/* @layer renderer-components @kind component */
import { Icon, Pressable } from '@drizztdourden08/tessera/primitives';
import type { DebugRoundButtonProps } from '../DebugFloatingControls.type';

const DebugRoundButton = (props: DebugRoundButtonProps) => {
  const { className, icon, label, onPress, dragging, onPointerDown, onPointerMove, onPointerUp } = props;

  return (
    <Pressable
      className={`debug-round-button ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onClick={() => {
        if (!dragging) onPress();
      }}
      title={label}
      aria-label={label}
    >
      <Icon name={icon} />
    </Pressable>
  );
};

export { DebugRoundButton };
