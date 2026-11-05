/* @layer bridge-wasm @kind logic */
import {
  CK_EXPORT_VIEW_BLACK_BOTTOM, CK_EXPORT_VIEW_BLACK_LEFT, CK_EXPORT_VIEW_BLACK_RIGHT, CK_EXPORT_VIEW_BLACK_TOP, CK_EXPORT_VIEW_HEIGHT,
  CK_EXPORT_VIEW_SCENE, CK_EXPORT_VIEW_WIDTH, CK_VIEW_SCENE_FIELD,
} from './view-black.constants';
import type { CkCanvasSize, CkViewBlack, CkViewCalls } from './view-black.type';

const viewBlackOf = (calls: CkViewCalls | null, canvas: CkCanvasSize): CkViewBlack | null => {
  if (!calls || !calls.has(CK_EXPORT_VIEW_SCENE) || !calls.has(CK_EXPORT_VIEW_BLACK_TOP)) return null;
  const viewWidth = calls.number(CK_EXPORT_VIEW_WIDTH);
  const viewHeight = calls.number(CK_EXPORT_VIEW_HEIGHT);
  if (viewWidth <= 0 || viewHeight <= 0 || canvas.width <= 0 || canvas.height <= 0) return null;
  const scaleX = canvas.width / viewWidth;
  const scaleY = canvas.height / viewHeight;
  return {
    field: calls.number(CK_EXPORT_VIEW_SCENE) === CK_VIEW_SCENE_FIELD,
    top: calls.number(CK_EXPORT_VIEW_BLACK_TOP) * scaleY,
    bottom: calls.number(CK_EXPORT_VIEW_BLACK_BOTTOM) * scaleY,
    left: calls.number(CK_EXPORT_VIEW_BLACK_LEFT) * scaleX,
    right: calls.number(CK_EXPORT_VIEW_BLACK_RIGHT) * scaleX,
  };
};

export { viewBlackOf };
