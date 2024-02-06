import React, { useCallback, useEffect, useRef, useState } from "react";

export default function useIntersectionObserver(
  observerTarget: React.RefObject<HTMLElement> | null,
  observerRoot?: React.RefObject<HTMLElement> | null,
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

  const observerCallback = useCallback<IntersectionObserverCallback>(
    ([entry]) => {
      const intersectRatioDiffAbs =
        intersectionEntry === undefined
          ? 0
          : Math.abs(
              intersectionEntry.intersectionRatio - entry.intersectionRatio
            );

      if (
        !intersectionEntry ||
        intersectRatioDiffAbs >= validIntersectRatioInterval
      ) {
        setIntersectionEntry(entry);
      }
    },
    [intersectionEntry, validIntersectRatioInterval]
  );

  const observerInitOptions = useRef<IntersectionObserverInit>({
    root: observerRoot?.current ?? document.body,
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
  });

  useEffect(() => {
    if (observerTarget && observerTarget.current) {
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        observerCallback,
        observerInitOptions.current
      );

      observer.current.observe(observerTarget.current);
      prevObserverOptions.current = observerOptions;
    }
  }, [
    observerTarget,
    observerRoot,
    observerCallback,
    observerOptions,
    observerInitOptions,
  ]);

  return { intersectionEntry };
}
