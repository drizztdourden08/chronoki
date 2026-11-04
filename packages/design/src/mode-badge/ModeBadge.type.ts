/* @layer renderer-components @kind types */
type GateMode = 'original' | 'modified';

interface ModeBadgeProps {
  mode: GateMode;
  className?: string;
}

export type { GateMode, ModeBadgeProps };
