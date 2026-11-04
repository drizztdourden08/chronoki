/* @layer renderer-components @kind logic */
import type { BootedPlan, SessionPicture } from '../GameLayer.type';
import { frameKeyOf } from './frame-key-of';
import { pictureFrameOf } from './picture-frame-of';

const sessionPictureOf = (booted: BootedPlan, planned: BootedPlan): SessionPicture => {
  const sameFrame = frameKeyOf(booted.settings) === frameKeyOf(planned.settings);
  return { frame: pictureFrameOf(booted.settings), ratio: sameFrame ? planned.ratio : booted.ratio };
};

export { sessionPictureOf };
