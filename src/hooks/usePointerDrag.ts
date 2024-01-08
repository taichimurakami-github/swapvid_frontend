import { useCallback, useRef } from "react";

export function usePointerDrag<DragCanvasElem extends HTMLDivElement>(options: {
  onPointerDownHook?: (
    e: React.PointerEvent<DragCanvasElem>,
    isDragging: boolean
  ) => void;
  onPointerUpHook?: (
    e: React.PointerEvent<DragCanvasElem>,
    isDragging: boolean
  ) => void;
  onPointerMoveHook?: (
    e: React.PointerEvent<DragCanvasElem>,
    isDragging: boolean,
    dragStartPosition: { left: number; top: number }
  ) => void;
}) {
  const isDragging = useRef(false);
  const dragStartPoint = useRef<{ left: number; top: number } | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<DragCanvasElem>) => {
      isDragging.current = true;
      dragStartPoint.current = {
        left: e.clientX,
        top: e.clientY,
      };

      options?.onPointerDownHook &&
        options.onPointerDownHook(e, isDragging.current);
    },
    [isDragging, dragStartPoint, options]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<DragCanvasElem>) => {
      isDragging.current = false;
      dragStartPoint.current = null;

      options?.onPointerUpHook &&
        options.onPointerUpHook(e, isDragging.current);
    },
    [isDragging, dragStartPoint, options]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<DragCanvasElem>) => {
      options?.onPointerMoveHook &&
        dragStartPoint.current &&
        options.onPointerMoveHook(
          e,
          isDragging.current,
          dragStartPoint.current
        );
    },
    [isDragging, dragStartPoint, options]
  );

  return {
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerMove: handlePointerMove,
    },
    isDragging: isDragging.current,
  };
}
