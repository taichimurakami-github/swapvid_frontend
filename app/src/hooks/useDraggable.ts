import { PointerEvent, useCallback, useRef } from "react";

export function useHandleClickWithDrag<T extends HTMLElement>(
  pointerUpHandler?: (e?: PointerEvent<T>) => void,
  interval_ms?: number
) {
  const INTERVAL_MS = interval_ms ?? 100;
  const mouseDownAt = useRef(0);

  const handlePointerDown = useCallback(() => {
    mouseDownAt.current = Date.now();
  }, [mouseDownAt]);

  const handlePointerUp = useCallback(
    (e: PointerEvent<T>) => {
      const now = Date.now();

      // initialのmouseDownAtは0なので，Math.absを使用すると強制的に10^8オーダーの自然数になることで処理を回避
      if (
        Math.abs(now - mouseDownAt.current) < INTERVAL_MS &&
        pointerUpHandler
      ) {
        pointerUpHandler(e);
        mouseDownAt.current = 0;
      }
    },
    [mouseDownAt, pointerUpHandler, INTERVAL_MS]
  );

  return {
    onPointerUp: handlePointerUp,
    onPointerDown: handlePointerDown,
  };
}
