/* @layer renderer-appshell @kind logic */
import { totals } from './audio-frame-totals';

const audioFrameTotal = (): number => totals.frames;

export { audioFrameTotal };
