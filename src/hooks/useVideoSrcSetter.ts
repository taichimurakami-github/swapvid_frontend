import { TMediaSourceObject } from "@/types/swapvid";
import React, { useCallback } from "react";

type CleanupFunction = () => void;

export function useVideoSrcSetter() {
  const handleSetVideoSrc = useCallback(
    (
      videoSrc: string | TMediaSourceObject | null,
      videoElementRef: React.RefObject<HTMLVideoElement> | null
    ): CleanupFunction | undefined => {
      if (videoElementRef?.current && videoSrc) {
        const videoElement = videoElementRef.current;
        switch (typeof videoSrc) {
          case "string":
            videoElement.src = videoSrc;
            return () => {
              videoElement.src = "";
            };

          default:
            videoElement.srcObject = videoSrc;
            return () => {
              videoElement.srcObject = null;
            };
        }
      }
    },
    []
  );

  return handleSetVideoSrc;
}
