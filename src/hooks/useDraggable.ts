import React, { MouseEvent, useCallback, useRef } from "react";

export function useHandleClickWithDrag<T extends HTMLElement>(
  mouseUpHandler?: (e?: Event) => void,
  interval_ms?: number
) {
  const INTERVAL_MS = interval_ms ?? 100;
  const mouseDownAt = useRef(0);

  const handleMouseDown = useCallback(() => {
    mouseDownAt.current = Date.now();
  }, [mouseDownAt]);

  const handleMouseUp = useCallback(
    (e: Event) => {
      const now = Date.now();

      // initialのmouseDownAtは0なので，Math.absを使用すると強制的に10^8オーダーの自然数になることで処理を回避
      if (Math.abs(now - mouseDownAt.current) < INTERVAL_MS && mouseUpHandler) {
        mouseUpHandler(e);
        mouseDownAt.current = 0;
      }
    },
    [mouseDownAt]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const now = Date.now();

      // initialのmouseDownAtは0なので，Math.absを使用すると強制的に10^8オーダーの自然数になることで処理を回避
      if (Math.abs(now - mouseDownAt.current) < INTERVAL_MS && mouseUpHandler) {
        mouseUpHandler(e);
        mouseDownAt.current = 0;
      }
    },
    [mouseDownAt]
  );

  return {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onTouchStart: handleMouseDown,
    onTouchEnd: handleTouchEnd,
  };
}
