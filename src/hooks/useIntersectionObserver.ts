import React, { RefObject, useEffect, useRef, useState } from "react";

export default function useIntersectionObserver(
  observerTarget: RefObject<HTMLElement>,
  observerRoot?: RefObject<HTMLElement>,
  validIntersectRatioInterval = 0.1,
  observerOptions?: {
    rootMargin?: string;
    threshold?: number | number[];
  }
) {
  const [intersectionEntry, setIntersectionEntry] =
    useState<IntersectionObserverEntry>();
  const observer = useRef<null | IntersectionObserver>(null);
  const prevObserverOptions = useRef<IntersectionObserverInit>();

  useEffect(() => {
    if (observerTarget.current) {
      if (observer.current) {
        observer.current.disconnect();
      }

      if (observerTarget.current) {
        observer.current = new IntersectionObserver(
          ([entry]) => {
            const intersectRatioDiffAbs =
              intersectionEntry === undefined
                ? 0
                : Math.abs(
                    intersectionEntry.intersectionRatio -
                      entry.intersectionRatio
                  );

            if (
              !intersectionEntry ||
              intersectRatioDiffAbs >= validIntersectRatioInterval
            ) {
              setIntersectionEntry(entry);
            }
          },
          {
            root: observerRoot?.current,
            threshold: (() => {
              const thresholds = [];
              const numSteps = 20;

              for (let i = 1.0; i <= numSteps; i++) {
                const ratio = i / numSteps;
                thresholds.push(ratio);
              }

              thresholds.push(0);
              return thresholds;
            })(),
          }
        );

        observer.current.observe(observerTarget.current);
        prevObserverOptions.current = observerOptions;
      }
    }
  }, [
    observerTarget,
    observerTarget.current,
    observerRoot,
    observerRoot?.current,
  ]);

  return { intersectionEntry };
}
