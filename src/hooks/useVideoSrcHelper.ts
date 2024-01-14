import { TMediaSourceObject } from "@/types/swapvid";
import React, { useCallback, useEffect } from "react";

type CleanupFunction = () => void;

export function useAutoVideoSrcInjecter(
  videoRef: React.RefObject<HTMLVideoElement> | null | undefined,
  videoSrc: string | TMediaSourceObject | null | undefined,
  onVideoSrcSetHook?: (
    videoRef: React.RefObject<HTMLVideoElement> | null | undefined,
    videoSrc: string | TMediaSourceObject | null | undefined
  ) => void
) {
  const videoElement = videoRef?.current;

  const handleSetVideoSrc = useCallback(
    (
      videoSrc: string | TMediaSourceObject | null | undefined,
      videoElement: HTMLVideoElement | null | undefined
    ): CleanupFunction | undefined => {
      if (!videoElement || !videoSrc) return;

      onVideoSrcSetHook && onVideoSrcSetHook(videoRef, videoSrc);

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
    },
    []
  );

  useEffect(() => {
    if (videoElement) {
      handleSetVideoSrc(videoSrc, videoElement);
    }
  }, [videoSrc, handleSetVideoSrc, videoRef, videoElement]);

  return handleSetVideoSrc;
}
