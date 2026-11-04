/* @layer bridge-wasm @kind logic */
import type { GameInfoClock } from '@chronoki/game-core';
import { CLOCK_PAD } from './game-info.constants';

const pad = (n: number): string => String(n).padStart(CLOCK_PAD, '0');

const formatClock = ({ hours, minutes, seconds }: GameInfoClock): string => `${hours}:${pad(minutes)}:${pad(seconds)}`;

export { formatClock };
