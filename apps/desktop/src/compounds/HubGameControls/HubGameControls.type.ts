/* @layer renderer-components @kind types */
interface HubGameControlsProps {
  isGameRunning: boolean;
  isPaused: boolean;
  showPlay: boolean;
  size?: 'sm' | 'md';
  onStartGame: () => void;
  onStopGame: () => void;
  onResetGame: () => void;
  onTogglePause: () => void;
}

export type { HubGameControlsProps };
