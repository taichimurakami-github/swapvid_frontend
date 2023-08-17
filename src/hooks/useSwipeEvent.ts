import { useEffect, useRef, useState } from "react";

type TSwipeState = null | {
  x: [boolean, number]; // [if swiped, swipe amount]
  y: [boolean, number]; // [if swiped, swipe amount]
  ptTouchStart: [number, number]; // (x, y)
  ptTouchEnd: [number, number]; // (x, y)
};

export const useSwipeEvent = (
  elementRef: HTMLElement | null,
  validDiffAbsPx = 50,
  samplingIntervalMs = 100
) => {
  const [swipeState, setSwipeState] = useState<TSwipeState>(null);

  const ptTouchStart = useRef<null | [number, number]>(null);
  const prevSamplingTime = useRef(0);

  useEffect(() => {
    if (elementRef) {
      elementRef.addEventListener("touchstart", (e) => {
        if (!ptTouchStart.current) {
          ptTouchStart.current = [e.touches[0].clientX, e.touches[0].clientY];
        }
      });

      elementRef.addEventListener("touchmove", (e) => {
        const now = Date.now();

        if (
          now - prevSamplingTime.current < samplingIntervalMs ||
          !ptTouchStart.current
        ) {
          return;
        } else {
          prevSamplingTime.current = Date.now();
        }

        const [prevX, prevY] = [
          ptTouchStart.current[0],
          ptTouchStart.current[1],
        ];
        const [currX, currY] = [e.touches[0].clientX, e.touches[0].clientY];

        const [diffX, diffY] = [currX - prevX, currY - prevY];

        if (diffX < validDiffAbsPx && diffY < validDiffAbsPx) return;

        setSwipeState({
          x: [diffX >= validDiffAbsPx, currX - diffX],
          y: [diffY >= validDiffAbsPx, currY - diffY],
          ptTouchStart: [prevX, prevY],
          ptTouchEnd: [currX, currY],
        });
      });

      elementRef.addEventListener("touchend", (e) => {
        ptTouchStart.current = null;
      });
    }
  }, [elementRef]);

  return { swipeState, setSwipeState };
};
