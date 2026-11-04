/* @layer renderer-components @kind types */
import type { SteamMarker } from '@app/storage/steam-store';

interface SteamStatusProps {
  marker: SteamMarker;
  busy: boolean;
  onRemove: () => void;
}

export type { SteamStatusProps };
