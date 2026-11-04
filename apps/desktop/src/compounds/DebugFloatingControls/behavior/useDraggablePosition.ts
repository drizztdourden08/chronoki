/* @layer renderer-components @kind hook */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { MIN_OFFSET } from '../DebugFloatingControls.constants';
import type { DragStart } from '../DebugFloatingControls.type';
import { readStoredOffset } from './read-stored-offset';
import { writeStoredOffset } from './write-stored-offset';

const useDraggablePosition = () => {
  const [offset, setOffset] = useState(readStoredOffset);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<DragStart | null>(null);

  const stackRef = useCallback((node: HTMLElement | null) => {
    node?.style.setProperty('--debug-top', `${offset.top}px`);
    node?.style.setProperty('--debug-right', `${offset.right}px`);
  }, [offset]);

  const onPointerDown = useCallback((event: PointerEvent) => {
    dragStart.current = { x: event.clientX, y: event.clientY, top: offset.top, right: offset.right };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [offset]);

  const onPointerMove = useCallback((event: PointerEvent) => {
    const start = dragStart.current;
    if (!start) return;
    setOffset({
      top: Math.max(MIN_OFFSET, start.top + event.clientY - start.y),
      right: Math.max(MIN_OFFSET, start.right - (event.clientX - start.x)),
    });
  }, []);

  const onPointerUp = useCallback(() => {
    dragStart.current = null;
    setDragging(false);
  }, []);

  useEffect(() => writeStoredOffset(offset), [offset]);

  return { stackRef, dragging, handlers: { onPointerDown, onPointerMove, onPointerUp } };
};

export { useDraggablePosition };
