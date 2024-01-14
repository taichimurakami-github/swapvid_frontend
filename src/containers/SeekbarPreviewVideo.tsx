import React, { useEffect, useRef } from "react";

import { videoSrcAtom } from "@/providers/jotai/store";
import { useAtomValue } from "jotai/react";
import { useAutoVideoSrcInjecter } from "@/hooks/useVideoSrcHelper";

const DEFAULT_UPDATE_INTERVAL_SEC = 5;

const _SeekbarPreviewVideo: React.FC<{
  currentPreviewTime_sec: number;
  updateInterval_sec?: number;
}> = ({ currentPreviewTime_sec, updateInterval_sec }) => {
  const videoSrc = useAtomValue(videoSrcAtom);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoCurrentTime = useRef(-Infinity);

  if (
    (updateInterval_sec ?? DEFAULT_UPDATE_INTERVAL_SEC) <
    Math.abs(currentPreviewTime_sec - videoCurrentTime.current)
  ) {
    videoCurrentTime.current = currentPreviewTime_sec;
  }

  useEffect(
    () => {
      if (!videoRef.current) return;
      videoRef.current.currentTime = videoCurrentTime.current;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [videoCurrentTime.current]
  );

  useAutoVideoSrcInjecter(videoRef, videoSrc);

  return (
    <video
      className="pointer-events-none"
      style={{ display: videoSrc ? "block" : "none" }}
      ref={videoRef}
      muted
      width="500"
    />
  );
};

export const SeekbarPreviewVideo = React.memo(_SeekbarPreviewVideo);
